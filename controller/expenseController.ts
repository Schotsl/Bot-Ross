// Import local packages
import {
  fetchExpenses,
  insertExpense,
  removeExpense,
} from "../repositories/expenseRepository.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { parse } from "https://deno.land/std@0.87.0/datetime/mod.ts";

const addExpense = async (
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

  if (!value.amount) {
    response.body = `Missing 'amount' property`;
    response.status = 400;
    return;
  }

  if (!value.taxonomy) {
    response.body = `Missing 'taxonomy' property`;
    response.status = 400;
    return;
  }

  if (!value.description) {
    response.body = `Missing 'description' property`;
    response.status = 400;
    return;
  }

  if (!value.date) {
    response.body = `Missing 'date' property`;
    response.status = 400;
    return;
  }

  if (!value.stakeholders || value.stakeholders.length === 0) {
    response.body = `Missing 'stakeholders' property`;
    response.status = 400;
    return;
  }

  // Validate the properties values
  if (value.title.length < 3 || value.title.length > 255) {
    response.body = `Invalid 'title' property`;
    response.status = 400;
    return;
  }

  if (value.description.length < 3 || value.description.length > 255) {
    response.body = `Invalid 'description' property`;
    response.status = 400;
    return;
  }

  if (typeof (value.amount) !== "number") {
    response.body = `Invalid 'amount' property`;
    response.status = 400;
    return;
  }

  // Only validate the boolean properties if they have been provided
  if (value.optional && typeof (value.optional) !== "boolean") {
    response.body = `Invalid 'optional' property`;
    response.status = 400;
    return;
  }

  if (value.compensated && typeof (value.compensated) !== "boolean") {
    response.body = `Invalid 'compensated' property`;
    response.status = 400;
    return;
  }

  try {
    value.date = parse(value.date, "d-M-yyyy");
  } catch (e) {
    response.body = `Invalid 'date' property`;
    response.status = 400;
    return;
  }

  // Return to the user
  response.body = await insertExpense(
    value.title,
    value.description,
    value.amount,
    value.date,
    value.taxonomy,
    value.stakeholders,
    value.optional,
    value.compensated,
  );
  response.status = 200;
};

const getExpenses = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch variables from URL GET parameters
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
  response.body = await fetchExpenses(limit, offset);
};

const deleteExpense = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  // Remove the expense using the ID from the URL
  const result = await removeExpense(params.id);
  response.status = result ? 204 : 404;
};

export { addExpense, deleteExpense, getExpenses };
