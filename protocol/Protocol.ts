import { Settings } from "../interface.ts";
import { Required } from "../enum.ts";

export abstract class Protocol {
  constructor(settings: Settings) {}

  abstract requiredSettings: Array<Required>;

  abstract executeProtocol(): void;
  abstract initializeProtocol(): void;
}
