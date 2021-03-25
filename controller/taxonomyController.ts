// Import local packages
import {
  fetchTaxonomies,
  insertTaxonomy,
  removeTaxonomy,
} from "../repositories/taxonomyRepository.ts";

// Import packages from URL
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

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

  // Return to the user
  response.body = await insertTaxonomy(value.title);
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

  // Return results to the user
  response.status = 200;
  response.body = await fetchTaxonomies(limit, offset);
};

const deleteTaxonomy = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  // Remove the contact using the ID from the URL
  const result = await removeTaxonomy(params.id);
  response.status = result ? 204 : 404;
};

export { addTaxonomy, deleteTaxonomy, getTaxonomies };
