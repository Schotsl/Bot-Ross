import { Settings } from "../interface.ts";
import { Required } from "../enum.ts";

export abstract class Abstraction {
  constructor(settingsObject: Settings) {}

  abstract systemSettings: Settings;
  abstract requiredSettings: Array<Required>;

  abstract executeProtocol(): void;
}