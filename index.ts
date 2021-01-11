// Import packages local
import { Schema } from "./interface.ts";
import { getSettings } from "./helper.ts";
import { Abstraction } from "./protocol/Protocol.ts";

// Import packages from URL
import { Database } from "https://deno.land/x/aloedb/mod.ts";
import { Intents, startBot } from "https://deno.land/x/discordeno@10.0.1/mod.ts";

// Initialize some variables
const database = new Database<Schema>("./database/protocols.json");
const settings = await getSettings();
const protocols: Array<Abstraction> = [];

// Start Discord bot
startBot({
  token: settings.discordAPI!,
  intents: [Intents.DIRECT_MESSAGES],
});

// Load every protocol class
import { Eagle } from "./protocol/Eagle/index.ts";
import { Prism } from "./protocol/Prism/index.ts";
import { Canary } from "./protocol/Canary/index.ts";

// Create an instance of every class
protocols.push(new Eagle(settings));
protocols.push(new Prism(settings));
protocols.push(new Canary(settings));

protocols.forEach(async (protocol) => {
  const name = protocol.constructor.name;
  const result = await database.findOne({ name });

  // If the protocol is new insert it into the database
  if (!result) {
    await database.insertOne({
      name: name,
      enabled: false,
    });
  }

  // If the protocol has been enabled load it
  if (result && result.enabled === true) {
    const permissions = protocol.requiredSettings;

    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i];

      // Abort if the settings is missing
      if (!settings.hasOwnProperty(permission)) {
        console.log(`🔐 [${name}] Permission ${permission} is missing`);
        return;
      }
    }

    // Set interval and run once
    console.log(`⌛ [${name}] Starting protocol`);
    setInterval(protocol.executeProtocol.bind(this), 1000 * 60 * 60);
    protocol.executeProtocol();
    console.log(`🙌 [${name}] Started protocol`);
  }
});
