import { Client, GatewayIntentBits, Events, Partials } from "discord.js";

class DiscordService {
  private discordClient: Client;

  constructor() {
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

    this.discordClient.on(Events.MessageReactionAdd, () => {
      console.log("ASDF");
    });

    this.discordClient.on(Events.MessageCreate, () => {
      console.log("ASDF");
    });

    // Log in to Discord with your client's token
    this.discordClient.login(process.env.DISCORD_TOKEN);

    // const channel = await client.channels.fetch("219765969571151872");
    // const channel = await client.channels.cache.get("219765969571151872");

    // const message =
    //   `## Received a new review\n` +
    //   `> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n` +
    //   `### I've generated a response\n` +
    //   `> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n` +
    //   `Please reply with your review response or click the ✅ emoji to confirm the generated response.`;
    // const response = await client.users.send("219765969571151872", message);
    // response.reactions.message.react("✅");
  }
}

export default DiscordService;
