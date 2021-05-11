import { v4 } from "https://deno.land/std@0.91.0/uuid/mod.ts";
import { parse } from "https://deno.land/std@0.87.0/datetime/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

import Expense from "../entity/ExpenseEntity.ts";
import ExpenseRepository from "../repository/ExpenseRepository.ts";
import InterfaceController from "./InterfaceController.ts";

export default class ExpenseController implements InterfaceController {
  private expenseRepository: ExpenseRepository;

  constructor(client: Client) {
    this.expenseRepository = new ExpenseRepository(client);
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
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

    if (!value.contacts || value.contacts.length === 0) {
      response.body = `Missing 'contacts' property`;
      response.status = 400;
      return;
    }

    // Check if required subproperties have been provided
    for (let i = 0; i < value.contacts.length; i++) {
      if (!value.contacts[i].part) {
        response.body = `Missing 'part' subproperty in 'contacts'`;
        response.status = 400;
        return;
      }

      if (!value.contacts[i].contact) {
        response.body = `Missing 'contact' subproperty in 'contacts`;
        response.status = 400;
        return;
      }
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

    // Validate the day property
    try {
      value.date = parse(value.date, "d-M-yyyy");
    } catch (e) {
      response.body = `Invalid 'date' property`;
      response.status = 400;
      return;
    }

    // Validate UUIDV4 properties
    if (v4.validate(value.contacts[0].taxonomy)) {
      response.body = `Invalid 'taxonomy' property`;
      response.status = 400;
      return;
    }

    for (let i = 0; i < value.contacts.length; i++) {
      if (typeof (value.contacts[0].part) !== "number") {
        response.body = `Invalid 'part' subproperty in 'contacts'`;
        response.status = 400;
        return;
      }

      if (v4.validate(value.contacts[0].contact)) {
        response.body = `Invalid 'contact' subproperty in 'contacts`;
        response.status = 400;
        return;
      }
    }

    // Create the Expense object
    const expense = new Expense();

    expense.date = value.date;
    expense.title = value.title;
    expense.amount = value.amount;
    // expense.contacts = value.contacts;
    expense.taxonomy = value.taxonomy;
    expense.description = value.description;

    // Only bind the optional values if they exist
    if (value.optional) expense.optional = value.optional;
    if (value.compensated) expense.compensated = value.compensated;

    // Return to the user
    response.body = await this.expenseRepository.addObject(
      expense
    );
    response.status = 200;
  }

  async getCollection(
    { request, response }: { request: Request; response: Response },
  ) {
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
    response.body = await this.expenseRepository.getCollection(offset, limit);
  }

  async removeObject(
    { params, response }: { params: { uuid: string }; response: Response },
  ) {
    // Remove the expense using the UUID from the URL
    const result = await this.expenseRepository.removeObject(params.uuid);
    response.status = result ? 204 : 404;
  }
}
