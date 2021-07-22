import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

export function cleanHex(hex: string): string {
  // Re-add the dashes and turn the string into lowercase
  const dashed = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${
    hex.substr(12, 4)
  }-${hex.substr(16, 4)}-${hex.substr(20)}`;
  const lower = dashed.toLowerCase();

  return lower;
}

export function initializeEnv(variables: string[]) {
  // Load .env file
  config({ export: true });

  // Loop over every key and make sure it has been set
  variables.forEach((variable: string) => {
    if (!Deno.env.get(variable)) {
      throw new Error(`${variable} .env variable must be set.`);
    }
  });
}
