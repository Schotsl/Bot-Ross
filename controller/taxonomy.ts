// Import packages local
import { Taxonomy } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

// Create the databases
const taxonomyDatabase = globalDatabase.collection<Taxonomy>("taxonomy");

const addTaxonomy = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  // Validate string property
  if (value.title.length === 0) {
    response.body = `Invalid 'title' property`;
    response.status = 400;
    return;
  }

  // Create new taxonomy and insert
  const taxonomy = new Taxonomy(value.title);
  taxonomy._id = await taxonomyDatabase.insertOne(taxonomy);

  // Return to the user
  response.body = taxonomy;
  response.status = 200;
};

const getTaxonomies = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch limit and offset from the GET parameters for pagination
  let limit = request.url.searchParams.get(`limit`)
    ? request.url.searchParams.get(`limit`)
    : 5;

  let offset = request.url.searchParams.get(`offset`)
    ? request.url.searchParams.get(`offset`)
    : 0;

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

  // Transform the strings into numbers
  limit = Number(limit);
  offset = Number(offset);

  // Get every taxonomy
  const taxonomies = await taxonomyDatabase.find().limit(limit).skip(offset);
  const total = await taxonomyDatabase.count();

  // Return results to the user
  if (taxonomies) {
    response.status = 200;
    response.body = {
      taxonomies,
      offset,
      total,
    };
  }

  response.status = 404;
};

const deleteTaxonomy = async (
  { params, response }: { params: { _id: string }; response: Response },
) => {
  // Delete the taxonomy
  const result = await taxonomyDatabase.deleteOne({
    _id: ObjectId(params._id),
  });

  // Return results to the user
  response.status = result ? 204 : 404;
};

const updateTaxonomy = async (
  { params, request, response }: {
    params: { _id: string };
    request: Request;
    response: Response;
  },
) => {
  // Get the stored taxonomy
  const _id = ObjectId(params._id);
  const taxonomy: Taxonomy | null = await taxonomyDatabase.findOne({ _id });

  // If no taxononmy has been found
  if (!taxonomy) {
    response.status = 404;
    return;
  }

  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  // Validate simple string properties
  if (value.title) taxonomy.title = value.title;

  // Update taxonomy value
  await taxonomyDatabase.updateOne({ _id: ObjectId(params._id) }, taxonomy);

  // Return results to the user
  response.body = taxonomy;
  response.status = 200;
};

export { addTaxonomy, deleteTaxonomy, getTaxonomies, updateTaxonomy };
