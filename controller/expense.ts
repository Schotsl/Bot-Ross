// Import packages local
import { Breakdown, Contact, Expense, Taxonomy } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { parse } from "https://deno.land/std@0.87.0/datetime/mod.ts";

// Create the databases
const taxonomyDatabase = globalDatabase.collection<Taxonomy>("taxonomy");
const expenseDatabase = globalDatabase.collection<Expense>("expense");
const contactDatabase = globalDatabase.collection<Contact>("contact");

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

  // Transform string properties into ObjectIDs
  value.taxonomy = ObjectId(value.taxonomy);
  value.stakeholders = value.stakeholders.map((stakeholder: string) =>
    ObjectId(stakeholder)
  );

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

  // Check if there is a Taxonomy with this ID
  if (!await taxonomyDatabase.count({ _id: value.taxonomy })) {
    response.body = `Invalid 'taxonomy' property`;
    response.status = 400;
    return;
  }

  // Make sure there is a Contact for every ObjectID
  value.stakeholders.forEach(async (stakeholder: ObjectId) => {
    if (!await contactDatabase.count({ _id: stakeholder })) {
      response.body = `Invalid 'stakeholders' property`;
      response.status = 400;
      return;
    }
  });

  try {
    value.date = parse(value.date, "d-M-yyyy");
  } catch (e) {
    response.body = `Invalid 'date' property`;
    response.status = 400;
    return;
  }

  // Create new Expense and insert
  const expense = new Expense(
    value.date,
    value.title,
    value.amount,
    value.taxonomy,
    value.description,
    value.stakeholders,
    value.optional,
    value.compensated,
  );
  const wrapper = await expenseDatabase.insertOne(expense);

  // Simplify the ID for the rest API
  expense.id = wrapper.$oid.toString();

  if (typeof expense.taxonomy === "object") {
    expense.taxonomy = expense.taxonomy.$oid.toString();
  }

  for (let i = 0; i < expense.stakeholders!.length; i++) {
    const stakeholder = expense.stakeholders![i];

    if (typeof stakeholder === "object") {
      expense.stakeholders![i] = stakeholder.$oid.toString();
    }
  }

  // Return to the user
  response.body = expense;
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

  // Get every Expense
  const expenses = await expenseDatabase.find().limit(limit).skip(offset);
  const total = await expenseDatabase.count();

  // Simplify the ID for the rest API
  expenses.map((expense: Expense) => {
    expense.id = expense._id!.$oid.toString();
    expense._id = undefined;

    if (typeof expense.taxonomy === "object") {
      expense.taxonomy = expense.taxonomy.$oid.toString();
    }

    for (let i = 0; i < expense.stakeholders!.length; i++) {
      const stakeholder = expense.stakeholders![i];

      if (typeof stakeholder === "object") {
        expense.stakeholders![i] = stakeholder.$oid.toString();
      }
    }
  });

  // Return results to the user
  response.status = 200;
  response.body = {
    expenses,
    offset,
    total,
  };
};

const deleteExpense = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  // Delete the Expense
  const result = await expenseDatabase.deleteOne({ _id: ObjectId(params.id) });

  // Return results to the user
  response.status = result ? 204 : 404;
};

export { addExpense, deleteExpense, getExpenses };
