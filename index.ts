import { getSettings } from "./helper.ts";
import { Database } from 'https://deno.land/x/aloedb/mod.ts'

import { Schema } from "./interface.ts";
import { Protocol } from "./protocol/Protocol.ts";

// Initialize some variables
const database = new Database<Schema>('./database/protocols.json');
const settings = await getSettings();
const protocols: Array<Protocol> = [];

// Load every protocol class
import { Eagle } from "./protocol/Eagle.ts";
import { Prism } from "./protocol/Prism.ts";
import { Canary } from "./protocol/Canary.ts";

// Create an instance of every class
protocols.push(new Eagle(settings));
protocols.push(new Prism(settings));
protocols.push(new Canary(settings));

protocols.forEach(async protocol => {
  const name = protocol.constructor.name;
  const result = await database.findOne({ name });
  
  // If this protocol is new
  if (!result) {
    // Disable it by default
    await database.insertOne({
      name: name,
      enabled: false,
    });
  }

  // If the protocol has been enabled load it
  if (result && result.enabled === true) {
    const permissions = protocol.required;

    // Loop over every required setting
    for (var i = 0; i < permissions.length; i ++) {
      const permission = permissions[i];

      // Abort if the settings is missing
      if (!settings.hasOwnProperty(permission)) {
        console.log(`${name} requires ${permission} to be set`);
        return;
      }
    }

    // If all is good start the protocol
    console.log(`Initializing ${name}`);
    protocol.initialize();
  }
});