import { existsSync } from "https://deno.land/std/fs/mod.ts";

import { Settings } from "./interface.ts"

export function getSettings(): Settings {
  if (!existsSync(`./settings.json`)) return { };

  const decoder = new TextDecoder(`utf-8`);
  const bytes = Deno.readFileSync(`settings.json`);
  const data = decoder.decode(bytes);
  return JSON.parse(data);
}

export function setSettings(settings: Settings): void {
  const encoder = new TextEncoder();
  const object = JSON.stringify(settings);
  const data = encoder.encode(object);

  Deno.writeFileSync(`settings.json`, data);
}