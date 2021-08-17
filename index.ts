import { Application } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { startBot } from "https://deno.land/x/discordeno/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { cron } from "https://deno.land/x/deno_cron/cron.ts";

import { bodyValidation, errorHandler } from "./middleware.ts";
import { initializeEnv } from "./helper.ts";

import router from "./router.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "BOT_ROSS_SERVER_PORT_OAK",
  "BOT_ROSS_SERVER_MYSQL_HOST",
  "BOT_ROSS_SERVER_MYSQL_USER",
  "BOT_ROSS_SERVER_MYSQL_PASS",
  "BOT_ROSS_SERVER_MYSQL_PORT",
  "BOT_ROSS_SERVER_MYSQL_BASE",
  "BOT_ROSS_SERVER_DISCORD_TOKEN",
]);

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

// Start the OAK REST API server
const reciever = +Deno.env.get("BOT_ROSS_SERVER_PORT_OAK")!;
const application = new Application();

application.addEventListener("error", (error) => {
  console.log(error);
});

application.addEventListener("listen", () => {
  console.log(`Listening on port ${reciever}`);
});

application.use(errorHandler);
application.use(bodyValidation);

application.use(oakCors());
application.use(router.routes());
application.use(router.allowedMethods());

// application.listen({ port: reciever });
await application.listen({ port: reciever, secure: true, certFile: "/Users/schotsl/cert.pem", keyFile: "/Users/schotsl/key.pem" });