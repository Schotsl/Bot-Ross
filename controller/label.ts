// Import packages local
import { Label, Mark } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

const labelDatabase = globalDatabase.collection<Label>("labels");
const markDatabase = globalDatabase.collection<Mark>("marks");

const addLabel = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  const emoji = value.emoji;
  const title = value.title;
  const offset = value.offset;
  const divider = value.divider;

  if (emoji.length === 0 || title.length === 0) {
    // Get the name of the invalid property
    const property = emoji.length === 0 ? `emoji` : `title`;

    response.body = `Invalid '${property}' property`;
    response.status = 400;
    return;
  }

  // Validate the divider value
  if (!Number.isInteger(divider) || !Number.isInteger(offset)) {
    // Get the name of the invalid property
    const property = Number.isInteger(divider) ? `offset` : `divider`;

    response.body = `Invalid '${property}' property`;
    response.status = 400;
    return;
  }

  // Insert the label and return to the user
  const id = await labelDatabase.insertOne({ emoji, title, divider, offset });
  response.body = { id, emoji, title, divider, offset };
  response.status = 200;
};

const getLabels = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Get every label
  const labels = await labelDatabase.find();

  // Return results to the user
  if (labels) {
    response.body = labels;
    response.status = 200;
  } else {
    response.status = 404;
  }
};

const deleteLabel = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  // Delete marks with refrences to the label
  await markDatabase.find({ label: ObjectId(params.id) });

  // Delete the label
  const result = await labelDatabase.deleteOne({ _id: ObjectId(params.id) });

  // Return results to the user
  response.status = result ? 204 : 404;
};

const updateLabel = async (
  { params, request, response }: {
    params: { id: string };
    request: Request;
    response: Response;
  },
) => {
  // Get the stored label
  const label: Label | null = await labelDatabase.findOne({
    _id: ObjectId(params.id),
  });

  // If no label has been found
  if (!label) {
    response.status = 404;
    return;
  }

  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  const emoji = value.emoji;
  const title = value.title;
  const offset = value.offset;
  const divider = value.divider;

  if (emoji.length === 0 || title.length === 0) {
    // Get the name of the invalid property
    const property = emoji.length === 0 ? `emoji` : `title`;

    // Inform the user
    response.body = `Invalid '${property}' property`;
    response.status = 400;
    return;
  }

  // Validate the divider value
  if (!Number.isInteger(divider) || !Number.isInteger(offset)) {
    // Get the name of the invalid property
    const property = Number.isInteger(divider) ? `offset` : `divider`;

    response.body = `Invalid '${property}' property`;
    response.status = 400;
    return;
  }

  // Return results to the user
  const id = await labelDatabase.updateOne({ _id: ObjectId(params.id) }, {
    emoji,
    title,
    divider,
    offset,
  });
  response.body = { id, emoji, title, divider, offset };
  response.status = 200;
};

export { addLabel, deleteLabel, getLabels, updateLabel };
