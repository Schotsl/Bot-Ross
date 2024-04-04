import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  PartialUser,
  User,
} from "discord.js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Message, MessageReaction, PartialMessageReaction } from "discord.js";
import { Review, ReviewState } from "../types";

class DiscordService {
  callbackReplied?: (review: Review) => void;
  callbackApproved?: (review: Review) => void;

  private discordClient: Client;
  private supabaseClient: SupabaseClient;

  constructor() {
    // Create a new supabase client
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );

    this.discordClient = new Client({
      intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });

    this.discordClient.once(Events.ClientReady, this.onReady.bind(this));
    this.discordClient.on(Events.MessageCreate, this.onReply.bind(this));
    this.discordClient.on(
      Events.MessageReactionAdd,
      this.onReaction.bind(this),
    );
  }

  async connect() {
    console.log("🛜 Connecting to Discord...");

    // Log in to Discord with your client's token
    await this.discordClient.login(process.env.DISCORD_TOKEN);
  }

  private onReady() {
    console.log(`🛜 Connected to Discord as ${this.discordClient.user?.tag}`);
  }

  private async onReply(message: Message<boolean>) {
    // Check what the message if replying to
    const id = message.reference?.messageId;

    const { data } = await this.supabaseClient
      .from("reviews")
      .select("*")
      .eq("discord", id)
      .eq("state", ReviewState.AI_PENDING)
      .single();

    // Make sure I'm the one replying
    if (!data || message.author.id !== "219765969571151872") {
      return;
    }

    // Return callback if the message is a reply
    this.callbackReplied?.({
      ...data,
      state: ReviewState.USER_REPLIED,
      response: message.content,
    });
  }

  private async onReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    const { data } = await this.supabaseClient
      .from("reviews")
      .select("*")
      .eq("discord", reaction.message.id)
      .eq("state", ReviewState.AI_PENDING)
      .single();

    // Make sure I'm the one replying
    if (!data || user.id !== "219765969571151872") {
      return;
    }

    // Return callback if the reaction is a check-mark
    if (reaction.emoji.name === "✅") {
      this.callbackApproved?.({
        ...data,
        state: ReviewState.AI_REPLIED,
      });
    }
  }

  async sendApproval(review: Review) {
    const channel = "219765969571151872";
    const content = `## Received a new review\n` +
      `> ${review.review}\n\n` +
      `### I've generated a response\n` +
      `> ${review.response}\n\n` +
      `Please reply with your review response or click the ✅ emoji to confirm the generated response.`;

    const message = await this.discordClient.users.send(channel, content);

    // Add a check=mark reaction to the message for the user to confirm
    message.reactions.message.react("✅");

    // Update the review with the message ID
    review.discord = message.id;

    return message.id;
  }

  async deleteApproval(review: Review) {
    // Delete the message from the channel
    const user = await this.discordClient.users.fetch("219765969571151872");
    const message = await user.dmChannel?.messages.fetch(review.discord!);

    message?.delete();
  }
}

export default DiscordService;
