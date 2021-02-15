import { Router } from "https://deno.land/x/oak/mod.ts";

import { addMark, deleteMark, getMarks } from "./controller/mark.ts";
import {
  addLabel,
  deleteLabel,
  getLabels,
  updateLabel,
} from "./controller/label.ts";

const router = new Router();

// Add the label endpoints
router.get("/label", getLabels);
router.put("/label/:uuid", updateLabel);
router.post("/label", addLabel);
router.delete("/label/:uuid", deleteLabel);

// Add the label endpoints
router.get("/mark/:date", getMarks);
router.post("/mark", addMark);
router.delete("/mark/:uuid", deleteMark);

export default router;
