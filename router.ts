import { Router } from "https://deno.land/x/oak/mod.ts";

import { getImage } from "./controller/imageController.ts";
import {
  addExpense,
  deleteExpense,
  getExpenses,
} from "./controller/expenseController.ts";
import {
  addContact,
  deleteContact,
  getContacts,
} from "./controller/contactController.ts";
import {
  addTaxonomy,
  deleteTaxonomy,
  getTaxonomies,
} from "./controller/taxonomyController.ts";

const router = new Router();

// Add the image endpoints
router.get("/image/:id", getImage);

// Add the contact endpoints
router.get("/contact", getContacts);
router.post("/contact", addContact);
router.delete("/contact/:id", deleteContact);

// Add the taxonomy endpoints
router.get("/taxonomy", getTaxonomies);
router.post("/taxonomy", addTaxonomy);
router.delete("/taxonomy/:id", deleteTaxonomy);

// Add the expense endpoints
router.get("/expense", getExpenses);
router.post("/expense", addExpense);
router.delete("/expense/:id", deleteExpense);

export default router;
