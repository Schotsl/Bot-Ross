import { existsSync } from "https://deno.land/std@0.100.0/fs/mod.ts";
import { Response } from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

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

export function wildcardMatch(
  message: string,
  wildcards: string | Array<string>,
) {
  // Transform a single string into an array
  if (typeof wildcards === "string") wildcards = [wildcards];

  for (let i = 0; i < wildcards.length; i++) {
    let wildcard = wildcards[i];
    const escapeRegex = (message: string) =>
      message.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, `\\$1`);

    // "."  => Find a single character, except newline or line terminator
    // ".*" => Matches any string that contains zero or more characters
    wildcard = wildcard.split(`*`).map(escapeRegex).join(`.*`);

    // "^"  => Matches any string with the following at the beginning of it
    // "$"  => Matches any string with that in front at the end of it
    wildcard = `^${wildcard}$`;

    //Create a regular expression object for matching string
    const regex = new RegExp(wildcard, `i`);
    const result = regex.test(message);

    // Only return if the result is true
    if (result) return result;
  }

  return false;
}

export function cleanHex(hex: string): string {
  // Re-add the dashes and turn the string into lowercase
  const dashed = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${
    hex.substr(12, 4)
  }-${hex.substr(16, 4)}-${hex.substr(20)}`;
  const lower = dashed.toLowerCase();

  return lower;
}

export async function getImage(
  { params, response }: {
    params: { directory: string; filename: string };
    response: Response;
  },
) {
  // Construct the image path with a fixed image directory
  const path = `./image/${params.directory}/${params.filename}`;

  if (!existsSync(path)) {
    response.status = 404;
    return;
  }

  // Read the file and return it to the user
  const image = await Deno.readFile(
    `./image/${params.directory}/${params.filename}`,
  );

  response.body = image;
  response.headers.set("Content-Type", "image/png");
  response.headers.set("Content-Length", String(image.byteLength));

  return;
}

export async function deleteImage(directory: string, filename: string) {
  // Construct the image path with a fixed image directory
  const path = `./image/${directory}/${filename}`;

  if (!existsSync(path)) {
    await Deno.remove(path);
  }
}

export function initializeEnv(variables: Array<string>) {
  // Load .env file
  config({ export: true });

  // Loop over every key and make sure it has been set
  variables.forEach((variable: string) => {
    if (!Deno.env.get(variable)) {
      throw new Error(`${variable} .env variable must be set.`);
    }
  });
}
