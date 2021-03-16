import { Router } from "https://deno.land/x/oak/mod.ts";

import {
  addExpense,
  deleteExpense,
  getExpenses,
} from "./controller/expense.ts";
import {
  addContact,
  deleteContact,
  getContacts,
} from "./controller/contact.ts";
import {
  addTaxonomy,
  deleteTaxonomy,
  getTaxonomies,
} from "./controller/taxonomy.ts";

const router = new Router();

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
