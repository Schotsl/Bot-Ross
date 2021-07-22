import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { sendMessage } from "https://deno.land/x/discordeno/mod.ts";
import { currentMonth } from "./helper.ts";
import { initializeEnv } from "../../helper.ts";

import PlausibleAPI from "../../../Plausible/index.ts";
import SiteRepository from "../../repository/SiteRepository.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "BOT_ROSS_SERVER_CHANNEL_ID",
  "BOT_ROSS_SERVER_PLAUSIBLE_TOKEN",
]);

export class Everest {
  private channel = Deno.env.get("BOT_ROSS_SERVER_CHANNEL_ID")!;
  private plausible = Deno.env.get("BOT_ROSS_SERVER_PLAUSIBLE_TOKEN")!;

  private repository?: SiteRepository;

  constructor(client: Client) {
    this.repository = new SiteRepository(client);
  }

  public async execute() {
    const collect = await this.repository!.getCollection(0, 999);
    const targets = collect.sites.filter((site) => site.plausible);

    // Fetch the views from PlausibleAPI
    const results = await Promise.all(targets.map(async (target) => {
      const plausible = new PlausibleAPI(
        this.plausible,
        target.url,
      );

      return await plausible.getAggregate("30d", "pageviews", true);
    }));

    // Generate the fields that we will include in the message
    const views = results.reduce((n, { value }) => n + value, 0);
    const fields = targets.map((target, index) => {
      const result = results[index];
      return {
        name: target.title,
        value: `**${result.value}** (${result.change}%)`,
      };
    });

    const color = 15105570;
    const title = `Plausible report for ${currentMonth()}`;
    const content = `It's that time of the month again`;
    const description = `This month we\'ve generated ${views} views!`;

    // Send the report
    sendMessage(BigInt(this.channel), {
      content,
      embeds: [{
        title,
        color,
        fields,
        description,
      }],
    });
  }
}
