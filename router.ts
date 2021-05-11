// deno-fmt-ignore-file

import { Router } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import { getImage } from "./helper.ts";

import TaxonomyController from "./classes/controller/TaxonomyController.ts";
import ExpenseController from "./classes/controller/ExpenseController.ts";
import ContactController from "./classes/controller/ContactController.ts";

const router = new Router();
const client = new Client();

await client.connect({
  hostname: String(Deno.env.get("hostname")),
  username: String(Deno.env.get("username")),
  password: String(Deno.env.get("password")),
  port: Number(Deno.env.get("port")),
  db: String(Deno.env.get("db")),
});


const expenseController = new ExpenseController(client);
const contactController = new ContactController(client);
const taxonomyController = new TaxonomyController(client);

router.get("/image/:directory/:filename", getImage);

router.get("/taxonomy", taxonomyController.getCollection.bind(taxonomyController));
router.post("/taxonomy", taxonomyController.addObject.bind(taxonomyController));
router.delete("/taxonomy/:uuid", taxonomyController.removeObject.bind(taxonomyController));

router.get("/contact", contactController.getCollection.bind(contactController));
router.post("/contact", contactController.addObject.bind(contactController));
router.delete("/contact/:uuid", contactController.removeObject.bind(contactController));

router.get("/expense", expenseController.getCollection.bind(expenseController));
router.post("/expense", expenseController.addObject.bind(expenseController));
router.delete("/expense/:uuid", expenseController.removeObject.bind(expenseController));

export default router;
