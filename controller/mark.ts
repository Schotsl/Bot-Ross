// Import packages local
import { Label, Mark } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { format, parse } from "https://deno.land/std@0.87.0/datetime/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

const labelDatabase = globalDatabase.collection<Label>("labels");
const markDatabase = globalDatabase.collection<Mark>("marks");

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

  // Make sure the date is a valid
  try {
    parse(value.date, "d-M-yyyy");
  } catch (e) {
    response.body = `Invalid 'date' property`;
    response.status = 400;
    return;
  }

  // This will transform 36-2-2021 into 8-3-2021
  const parsed = parse(value.date, "d-M-yyyy");
  const date = format(parsed, "d-M-yyyy");

  // Prevent double entries on the same label and date
  const result = await markDatabase.findOne({ label, date });

  if (result) {
    response.body = result;
    response.status = 200;
    return;
  }

  // Return to the user
  const _id = await markDatabase.insertOne({ label, date });
  response.body = { _id, label, date };
  response.status = 200;
};

const getMarks = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch limit and offset from the GET parameters for pagination
  let limit = request.url.searchParams.get(`limit`)
    ? request.url.searchParams.get(`limit`)
    : 5;

  let offset = request.url.searchParams.get(`offset`)
    ? request.url.searchParams.get(`offset`)
    : 0;

  let date = request.url.searchParams.get(`date`)
    ? request.url.searchParams.get(`date`)
    : format(new Date(), "d-M-yyyy");

  // Validate limit is a number
  if (isNaN(+offset!)) {
    response.body = `Invalid 'limit' property`;
    response.status = 400;
    return;
  }

  // Validate offset is a number
  if (isNaN(+offset!)) {
    response.body = `Invalid 'offset' property`;
    response.status = 400;
    return;
  }

  // Make sure the date is a valid
  try {
    parse(date!, "d-M-yyyy");
  } catch (e) {
    response.body = `Invalid 'date' property`;
    response.status = 400;
    return;
  }

  // Transform the strings into numbers
  limit = Number(limit);
  offset = Number(offset);

  const marks = await markDatabase.find({ date: date! }).limit(limit).skip(offset);

  // Return results to the user
  if (marks) {
    response.body = marks;
    response.status = 200;
  } else {
    response.status = 404;
  }
};

const deleteMark = async (
  { params, response }: { params: { _id: string }; response: Response },
) => {
  // Delete the mark
  const result = await markDatabase.deleteOne({ _id: ObjectId(params._id) });

  // Return results to the user
  response.status = result ? 204 : 404;
};

export { addMark, deleteMark, getMarks };
