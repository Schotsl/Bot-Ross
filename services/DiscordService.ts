import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  MessageReaction,
  User,
  PartialMessageReaction,
  PartialUser,
} from "discord.js";
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
      process.env.SUPABASE_KEY!
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

    this.discordClient.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    this.discordClient.on(
      Events.MessageReactionAdd,
      this.onReaction.bind(this)
    );

    this.discordClient.on(Events.MessageCreate, () => {
      console.log("ASDF");
    });

    // Log in to Discord with your client's token
    this.discordClient.login(process.env.DISCORD_TOKEN);
  }

  private async onReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) {
    const { data } = await this.supabaseClient
      .from("reviews")
      .select("*")
      .eq("discord", reaction.message.id)
      .single();

    if (user?.id === "547808321688698897") {
      return;
    }

    if (reaction.emoji.name === "✅") {
      await this.supabaseClient
        .from("reviews")
        .update({ ...data, state: ReviewState.AI_REPLIED })
        .eq("id", data.data.id);

      console.log("lets go!");

      // this.callbackApproved?.(review.data);
    }
  }

  async requestApproval(review: Review) {
    const channel = "219765969571151872";
    const content =
      `## Received a new review\n` +
      `> ${review.review}\n\n` +
      `### I've generated a response\n` +
      `> ${review.response}\n\n` +
      `Please reply with your review response or click the ✅ emoji to confirm the generated response.`;

    const message = await this.discordClient.users.send(channel, content);

    // Add a check=mark reaction to the message for the user to confirm
    message.reactions.message.react("✅");

    // Update the review with the message ID
    review.discord = message.id;

    await this.supabaseClient.from("reviews").insert(review);
  }
}

export default DiscordService;
