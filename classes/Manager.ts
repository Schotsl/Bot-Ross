import { Settings } from "../interface.ts";
import { Abstraction } from "./Protocol.ts";
import { getSettings, wildcardMatch } from "../helper.ts";

import { Intents, startBot, Message, sendDirectMessage } from "https://deno.land/x/discordeno@10.0.1/mod.ts";

// Import every protocol class
import { Eagle } from "./protocols/Eagle/index.ts";
import { Prism } from "./protocols/Prism/index.ts";
import { Morgan } from "./protocols/Morgan/index.ts";
import { Canary } from "./protocols/Canary/index.ts";


export class Manager {
  private session?: Abstraction;
  private settings: Settings = {}
  private protocols: Array<Abstraction> = [];

  async initializeManager() {
    this.settings = await getSettings();

    this.protocols.push(new Eagle(this.settings));
    this.protocols.push(new Prism(this.settings));
    this.protocols.push(new Morgan(this.settings));
    this.protocols.push(new Canary(this.settings));

    // Check every protocol
    for (let i = 0; i < this.protocols.length; i ++) {
      const protocol = this.protocols[i];

      // Fetch some variable with the index
      const constructor = protocol.constructor.name;
      const permissions = protocol.requiredSettings || [];

      // Check every permission
      for (let j = 0; j < permissions.length; j++) {
        const permission = permissions[j];

        // Abort if the settings is missing
        if (!this.settings.hasOwnProperty(permission)) {
          console.log(`🔐 [${constructor}] Permission ${permission} is missing`);
          return;
        }
      }

      // Set interval and run once
      if (protocol.executeProtocol) {
        console.log(`⌛ [${constructor}] Starting protocol`);

        setInterval(protocol.executeProtocol.bind(this), 1000 * 60 * 60);
        protocol.executeProtocol();
        
        console.log(`🙌 [${constructor}] Started protocol`);
      }
    }

    // Start the Discord bot
    startBot({
      token: this.settings.discordAPI!,
      intents: [ Intents.DIRECT_MESSAGES ],
      eventHandlers: { messageCreate: message => this.onMessage(message) }
    });

    // For some reason if I remove this line the code crashes
    sendDirectMessage("219765969571151872", "Booted! :)");
  }

  async onMessage(message: Message): Promise<void> {
    // Filter out bots
    if (message.author.bot) return;

    // A debug command
    if (message.content === `-session`) {
      const response = this.session ? `You're talking to ${this.session.constructor.name}` : `I'm sorry too say, but you're screaming into the void`;
      message.reply(response);
      return;
    }

    // If a session is active send the message there
    if (this.session) {
      // If the executeMessage returns false we should clear the session
      if (!this.session.executeMessage!(message)) this.session = undefined;
      return;
    }
    
    // Check every protocol
    for (let i = 0; i < this.protocols.length; i ++) {
      const protocol = this.protocols[i];
  
      // If triggers and a handler have been set
      if (protocol.messageTriggers && protocol.executeMessage) {
        const triggers = protocol.messageTriggers;
        const match = wildcardMatch(message.content, triggers);

        // If the command has been messaged
        if (match) {

          // Store the session if execute returns true
          const result = await protocol.executeMessage(message);
          if (result) this.session = protocol;
          return;
        }
      }
    }
  }
}