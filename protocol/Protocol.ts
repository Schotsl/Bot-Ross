import { Settings } from "../interface.ts";

export abstract class Protocol {
  constructor(settings: Settings) {};
  
  abstract required: Array<string>;
  
  abstract execute(): void;
  abstract initialize(): void;
}