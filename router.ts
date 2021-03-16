import { Router } from "https://deno.land/x/oak/mod.ts";

// import { addMark, deleteMark, getMarks } from "./controller/mark.ts";
import { addExpense, deleteExpense, getExpenses, getBreakdown } from "./controller/expense.ts";
// import {
//   addLabel,
//   deleteLabel,
//   getLabels,
//   updateLabel,
// } from "./controller/label.ts";
import {
  addTaxonomy,
  deleteTaxonomy,
  getTaxonomies,
  updateTaxonomy,
} from "./controller/taxonomy.ts";
import {
  addContact,
  deleteContact,
  getContacts,
  updateContact,
} from "./controller/contact.ts";

const router = new Router();

// Add the label endpoints
// router.get("/label", getLabels);
// router.put("/label/:_id", updateLabel);
// router.post("/label", addLabel);
// router.delete("/label/:_id", deleteLabel);

// Add the contact endpoints
router.get("/contact", getContacts);
router.put("/contact/:_id", updateContact);
router.post("/contact", addContact);
router.delete("/contact/:_id", deleteContact);

// Add the taxonomy endpoints
router.get("/taxonomy", getTaxonomies);
router.put("/taxonomy/:_id", updateTaxonomy);
router.post("/taxonomy", addTaxonomy);
router.delete("/taxonomy/:_id", deleteTaxonomy);

// Add the label endpoints
// router.get("/mark", getMarks);
// router.post("/mark", addMark);
// router.delete("/mark/:_id", deleteMark);

// Add the expense endpoints
router.get("/expense", getExpenses);
router.get("/breakdown", getBreakdown);
router.post("/expense", addExpense);
router.delete("/expense/:_id", deleteExpense);

export default router;
