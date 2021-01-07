import { getSettings } from "./helper.ts";
import { Database } from 'https://deno.land/x/aloedb/mod.ts'
import { Protocol } from "./interface.ts";

// Initialize some variables
const database = new Database<Protocol>('./database/protocols.json');
const settings = await getSettings();
const protocols = [];

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
      error: false,
      enabled: false,
    });
  }

  // If the protocol has been enabled load it
  if (result && result.enabled === true) {
    console.log(`Initializing ${name}`);
    protocol.initialize();
  }
});