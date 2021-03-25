// Import local packages
import { Contact, Expense, ExpenseCollection, Taxonomy } from "../interface.ts";
import { globalDatabase } from "../database.ts";

import { fetchTaxonomy } from "./taxonomyRepository.ts";
import { fetchContact } from "./contactRepository.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";

// Create the databases
const expenseDatabase = globalDatabase.collection<Expense>("expense_1");

export async function fetchExpenses(
  limit = 3,
  offset = 0,
): Promise<ExpenseCollection> {
  const expenses = await expenseDatabase.find().limit(limit).skip(offset);
  const total = await expenseDatabase.count();

  return { limit, total, offset, expenses: await mapArray(expenses) };
}

export async function fetchExpense(id: string): Promise<Expense> {
  const expense = await expenseDatabase.findOne({ _id: ObjectId(id) });

  return mapObject(expense!);
}

export async function insertExpense(
  title: string,
  description: string,
  amount: number,
  date: Date,
  taxonomy: string,
  contacts: Array<string>,
  optional = false,
  compensated = false,
) {
  const expense: Expense = {
    date,
    title,
    amount,
    optional,
    description,
    compensated,
  };

  expense._taxonomy = ObjectId(taxonomy);
  expense._contacts = contacts.map((contact) => ObjectId(contact));
  expense._id = await expenseDatabase.insertOne(expense);

  return mapObject(expense);
}

export async function removeExpense(id: string): Promise<boolean> {
  // Delete the expense and return the result
  return await expenseDatabase.deleteOne({ _id: ObjectId(id) }) ? true : false;
}

async function mapObject(expense: Expense): Promise<Expense> {
  // Transform Taxonomy ObjectId into Taxonomy object
  expense.taxonomy = await fetchTaxonomy(expense._taxonomy!.$oid.toString());
  expense._taxonomy = undefined;

  // Transform array of ObjectIds into an array of contacts
  expense.contacts = await Promise.all(
    expense._contacts!.map(async (_contact) =>
      await fetchContact(_contact.$oid.toString())
    ),
  );
  expense._contacts = undefined;

  // Transform the ID into a string
  expense.id = expense._id!.$oid.toString();
  expense._id = undefined;

  return expense;
}

async function mapArray(expenses: Array<Expense>): Promise<Array<Expense>> {
  // Pass every array entry to the map object function
  expenses = await Promise.all(expenses.map((expense) => mapObject(expense)));

  // Return the parse array
  return expenses;
}
