import { initializeEnv } from "./helper.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "BOT_ROSS_SERVER_MYSQL_HOST",
  "BOT_ROSS_SERVER_MYSQL_USER",
  "BOT_ROSS_SERVER_MYSQL_PASS",
  "BOT_ROSS_SERVER_MYSQL_PORT",
  "BOT_ROSS_SERVER_MYSQL_BASE",
  "BOT_ROSS_SERVER_DISCORD_TOKEN",
]);

import { startBot } from "https://deno.land/x/discordeno/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { cron } from "https://deno.land/x/deno_cron/cron.ts";

import { Everest } from "./protocols/Everest/index.ts";
import { Freya } from "./protocols/Freya/index.ts";
import { Eagle } from "./protocols/Eagle/index.ts";

const client = new Client();

// Fetch the variables and convert them to right datatype
const hostname = Deno.env.get("BOT_ROSS_SERVER_MYSQL_HOST")!;
const username = Deno.env.get("BOT_ROSS_SERVER_MYSQL_USER")!;
const password = Deno.env.get("BOT_ROSS_SERVER_MYSQL_PASS")!;
const port = +Deno.env.get("BOT_ROSS_SERVER_MYSQL_PORT")!;
const db = Deno.env.get("BOT_ROSS_SERVER_MYSQL_BASE")!;

// Connect to MySQL server
await client.connect({
  hostname,
  username,
  password,
  port,
  db,
});

await startBot({
  token: "NTQ3ODA4MzIxNjg4Njk4ODk3.XG14QQ.fILB1RHa5zotn7sHzFhl68_ghDw",
  intents: ["Guilds", "GuildMessages"],
});

const everest = new Everest(client);
const freya = new Freya(client);
const eagle = new Eagle();

cron("* * * * *", () => freya.execute());
cron("* * * * *", () => eagle.execute());
cron("0 0 1 * *", () => everest.execute());
