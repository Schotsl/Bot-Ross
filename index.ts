import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Manager } from "./classes/Manager.ts";

import router from "./router.ts";

const application = new Application();
const manager = new Manager();

manager.initializeManager();

application.use(oakCors({ origin: "*" }));
application.use(router.allowedMethods());
application.use(router.routes());

application.listen({ port: 42069 });
