// Import packages local
import { Label, Mark } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { format, parse } from "https://deno.land/std@0.87.0/datetime/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

// Create the databases
const labelDatabase = globalDatabase.collection<Label>("labels");
const markDatabase = globalDatabase.collection<Mark>("marks");

const addMark = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  // Validate the label property
  if (!await labelDatabase.count({ _id: ObjectId(value.label) })) {
    response.body = `Invalid 'label' property`;
    response.status = 400;
    return;
  }

  // Validate the date property
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

  // Check if there is already an entry with this label and date
  const result = await markDatabase.findOne({
    label: ObjectId(value.label),
    date,
  });

  // "Pretend" that we inserted into the database
  if (result) {
    response.body = result;
    response.status = 200;
    return;
  }

  // Create new mark and insert
  const mark = new Mark(ObjectId(value.label), date);
  mark._id = await markDatabase.insertOne(mark);

  // Return to the user
  response.body = mark;
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

  const date = request.url.searchParams.get(`date`)
    ? request.url.searchParams.get(`date`)
    : format(new Date(), "d-M-yyyy");

  // Validate limit is a number
  if (isNaN(+limit!)) {
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

  const marks = await markDatabase.find({ date: date! }).limit(limit).skip(
    offset,
  );
  const total = await markDatabase.count({ date: date! });

  // Return results to the user
  if (marks) {
    response.status = 200;
    response.body = {
      marks,
      offset,
      total,
    };
  }

  response.status = 404;
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
