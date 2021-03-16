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

  // Check if required properties have been provided
  if (!value.title) {
    response.body = `Missing 'title' property`;
    response.status = 400;
    return;
  }

  // Validate the properties values
  if (value.title.length < 3 || value.title.length > 255) {
    response.body = `Invalid 'title' property`;
    response.status = 400;
    return;
  }

  // Create new taxonomy and insert
  const taxonomy = new Taxonomy(value.title);
  const wrapper = await taxonomyDatabase.insertOne(taxonomy);

  // Simplify the ID for the rest API
  taxonomy.id = wrapper.$oid.toString();

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

  // Simplify the ID for the rest API
  taxonomies.map((taxonomy) => {
    taxonomy.id = taxonomy._id!.$oid.toString();
    taxonomy._id = undefined;
  })

  // Return results to the user
  response.status = 200;
  response.body = {
    taxonomies,
    offset,
    total,
  };
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

export { addTaxonomy, deleteTaxonomy, getTaxonomies };
