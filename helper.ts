import { existsSync } from "https://deno.land/std/fs/mod.ts";

import { Settings } from "./interface.ts";

export function getSettings(): Settings {
  // Make sure the file actually exists
  if (!existsSync(`./settings.json`)) throw Error("No settings file found");

  // Parse the settings.json file into a TypeScript object
  const decoder = new TextDecoder(`utf-8`);
  const bytes = Deno.readFileSync(`settings.json`);
  const data = decoder.decode(bytes);
  return JSON.parse(data);
}

export function setSettings(settings: Settings): void {
  // Encode the TypeScript object into JSON
  const encoder = new TextEncoder();
  const object = JSON.stringify(settings);
  const data = encoder.encode(object);

  // Write the file
  Deno.writeFileSync(`settings.json`, data);
}
