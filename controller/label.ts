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
  const emoji: string = value.emoji;
  const title: string = value.title;

  if (emoji.length === 0 || title.length === 0) {
    // Get the name of the invalid property
    const property = emoji.length === 0 ? `emoji` : `title`;

    // Inform the user
    response.body = `Invalid '${property}' property`;
    response.status = 400;
    return;
  }

  // Insert the label and return to the user
  const id = await labelDatabase.insertOne({ emoji, title });
  response.body = { id, emoji, title };
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
  { params, response }: { params: { uuid: string }; response: Response },
) => {
  const uuid = params.uuid;

  // Delete marks with refrences to the label
  await markDatabase.find({ label: ObjectId(params.uuid) });

  // Delete the label
  const result = await labelDatabase.deleteOne({ _id: ObjectId(uuid) });

  // Return results to the user
  response.status = result ? 204 : 404;
};

const updateLabel = async (
  { params, request, response }: {
    params: { uuid: string };
    request: Request;
    response: Response;
  },
) => {
  // Get the stored label
  const uuid = params.uuid;
  const label: Label | null = await labelDatabase.findOne({
    _id: ObjectId(uuid),
  });

  // If no label has been found
  if (!label) {
    response.status = 404;
    return;
  }

  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;
  const emoji: string = value.emoji;
  const title: string = value.title;

  if (emoji.length === 0 || title.length === 0) {
    // Get the name of the invalid property
    const property = emoji.length === 0 ? `emoji` : `title`;

    // Inform the user
    response.body = `Invalid '${property}' property`;
    response.status = 400;
    return;
  }

  // Return results to the user
  const id = await labelDatabase.updateOne({ _id: ObjectId(uuid) }, value);
  response.body = { id, emoji, title };
  response.status = 200;
};

export { addLabel, deleteLabel, getLabels, updateLabel };
