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

// Got this function from https://stackoverflow.com/a/32402438

export function wildcardMatch(message: string, wildcards: string | Array<string>) {
  // Transform a single string into an array
  if (typeof wildcards === `string`) wildcards = [wildcards];

  for (let i = 0; i < wildcards.length; i ++) {
    let wildcard = wildcards[i];
    let escapeRegex = (message: string) => message.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, `\\$1`);

    // "."  => Find a single character, except newline or line terminator
    // ".*" => Matches any string that contains zero or more characters
    wildcard = wildcard.split(`*`).map(escapeRegex).join(`.*`);
  
    // "^"  => Matches any string with the following at the beginning of it
    // "$"  => Matches any string with that in front at the end of it
    wildcard = `^${wildcard}$`
  
    //Create a regular expression object for matching string
    const regex = new RegExp(wildcard, `i`);
    const result = regex.test(message);

    // Only return if the result is true
    if (result) return result;
  }

  return false;
}