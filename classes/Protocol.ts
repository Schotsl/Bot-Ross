import { Settings } from "../interface.ts";
import { Required } from "../enum.ts";
import { Message } from "https://deno.land/x/discordeno@10.0.1/src/api/structures/message.ts";

export interface Abstraction {
  messageTriggers?: Array<string>;
  requiredSettings?: Array<Required>;

  executeMessage?(message: Message): Promise<boolean>;
  executeProtocol?(): void;
}

export abstract class Abstraction {
  abstract systemSettings: Settings;

  constructor(settingsObject: Settings) {}
}
