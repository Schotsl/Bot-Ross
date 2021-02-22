import { Router } from "https://deno.land/x/oak/mod.ts";

import { addMark, deleteMark, getMarks } from "./controller/mark.ts";
import {
  addLabel,
  deleteLabel,
  getLabels,
  updateLabel,
} from "./controller/label.ts";
import {
  addTaxonomy,
  deleteTaxonomy,
  getTaxonomies,
  updateTaxonomy,
} from "./controller/taxonomy.ts";

const router = new Router();

// Add the label endpoints
router.get("/label", getLabels);
router.put("/label/:id", updateLabel);
router.post("/label", addLabel);
router.delete("/label/:id", deleteLabel);

// Add the taxonomy endpoints
router.get("/taxonomy", getTaxonomies);
router.put("/taxonomy/:id", updateTaxonomy);
router.post("/taxonomy", addTaxonomy);
router.delete("/taxonomy/:id", deleteTaxonomy);

// Add the label endpoints
router.get("/mark/:date", getMarks);
router.post("/mark", addMark);
router.delete("/mark/:id", deleteMark);

export default router;
