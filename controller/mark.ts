// Import packages local
import { Label, Mark } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { format } from "https://deno.land/std@0.87.0/datetime/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

const markDatabase = globalDatabase.collection<Mark>("marks");
const labelDatabase = globalDatabase.collection<Label>("labels");

const addMark = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;
  const label = ObjectId(value.label);

  // Validate the label ID
  if (!await labelDatabase.count({ _id: label })) {
    response.body = `Invalid 'label' property`;
    response.status = 400;
    return;
  }

  // Generate the date string
  const now = new Date();
  const date = format(now, `d-M-yyyy`);

  // Return to the user
  const id = markDatabase.insertOne({ label, date });
  response.body = { id, label, date };
  response.status = 200;
};

const getMarks = async (
  { params, response }: { params: { date: string }; response: Response },
) => {
  // Get the date from the URL
  const date = params.date;
  const marks = await markDatabase.find({ date: date });

  // Return results to the user
  if (marks) {
    response.body = marks;
    response.status = 200;
  } else {
    response.status = 404;
  }
};

const deleteMark = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  // Delete the mark
  const id = params.id;
  const result = await markDatabase.deleteOne({ _id: ObjectId(id) });

  // Return results to the user
  response.status = result ? 204 : 404;
};

export { addMark, deleteMark, getMarks };
