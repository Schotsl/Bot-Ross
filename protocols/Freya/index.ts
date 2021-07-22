import { isUp } from "https://deno.land/x/up/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { sendMessage } from "https://deno.land/x/discordeno/mod.ts";
import { initializeEnv } from "../../helper.ts";

import UserEntity from "../../entity/UserEntity.ts";
import SiteRepository from "../../repository/SiteRepository.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "BOT_ROSS_SERVER_CHANNEL_ID",
]);

export class Freya {
  private channel = Deno.env.get("BOT_ROSS_SERVER_CHANNEL_ID")!;

  private repository?: SiteRepository;

  constructor(client: Client) {
    this.repository = new SiteRepository(client);
  }

  public async execute() {
    const collect = await this.repository!.getCollection(0, 999);
    const targets = collect.sites.filter((site) => site.status);

    targets.forEach(async (target) => {
      const current = await isUp(`https://${target.url}`);
      const previous = target.online;

      if (current && !previous || !current && previous) {
        const back = current && !previous;
        const owner = target.owner as UserEntity;

        sendMessage(BigInt(this.channel), {
          embeds: [{
            title: back ? "Big W!" : "Ruh-roh!",
            color: back ? 3066993 : 15158332,
            description: back
              ? `Great news, ${target.title} (https://${target.url}) has come back online`
              : `Heads up <@${owner.discord}>, ${target.title} (https://${target.url}) has gone offline`,
          }],
        });

        target.owner = owner.uuid;
        target.online = back;

        this.repository!.updateObject(target);
      }
    });
  }
}
