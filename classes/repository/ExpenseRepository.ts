import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";

import ExpenseEntity from "../entity/ExpenseEntity.ts";
import ExpenseMapper from "../mapper/ExpenseMapper.ts";
import ExpenseCollection from "../collection/ExpenseCollection.ts";
import InterfaceRepository from "./RepositoryInterface.ts";

export default class ExpenseRepository implements InterfaceRepository {
  private expenseMapper: ExpenseMapper;
  private client: Client;

  constructor(client: Client) {
    this.client = client;

    this.expenseMapper = new ExpenseMapper(client);
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<ExpenseCollection> {
    // Get expenses from the database with the given offset and limit
    const rowsResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, created, updated, \`date\`, title, amount, optional, compensated, description FROM expense LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    // Count the total amount of expenses stored in the database
    const totalResult = await this.client.execute(
      `SELECT COUNT(uuid) AS total from expense`,
    );

    // Map the database rows into a proper array of Expenses
    const rows = rowsResult.rows!;
    const total = totalResult.rows![0].total;
    return await this.expenseMapper.mapCollection(rows, offset, limit, total);
  }

  public async getObject(uuid: string): Promise<ExpenseEntity> {
    // Get the expense from the database by its UUUUID
    const rowResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, created, updated, \`date\`, title, amount, optional, compensated, description FROM expense WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Map the database row into a single Expense object
    const row = rowResult.rows![0];
    return this.expenseMapper.mapObject(row);
  }

  public async addObject(
    expense: ExpenseEntity,
  ): Promise<ExpenseEntity> {
    // Insert the expense into the database
    await this.client.execute(
      `INSERT INTO expense (uuid, taxonomy, \`date\`, title, amount, optional, compensated, description) VALUES(UNHEX(REPLACE('${expense.uuid}', '-', '')), UNHEX(REPLACE('${expense.taxonomy}', '-', '')), '${
        expense.date.toISOString().slice(0, 19).replace("T", " ")
      }', '${expense.title}', ${expense.amount}, ${expense.optional}, ${expense.compensated}, '${expense.description}')`,
    );

    // Create the insert query
    // let query = `INSERT INTO contact_expense (contact, expense, part) VALUES `;

    // Append every many-to-many relation
    // expense.contacts.forEach((object) => {
    //   query +=
    //     `(UNHEX(REPLACE('${object.contact}', '-', '')), UNHEX(REPLACE('${expense.uuid}', '-', '')), ${object.part}), `;
    // });

    // Remove the comma from the end of the string and await the query
    // query = query.substr(0, query.length - 2);
    // await this.client.execute(query);

    // Fetch the object from the database and map it
    return await this.getObject(expense.uuid);
  }

  public async removeObject(uuid: string): Promise<boolean> {
    // Delete the expense from the database by its UUUUID
    const deleteResult = await this.client.execute(
      `DELETE FROM expense WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Simplify the result to a boolean
    return deleteResult.affectedRows === 0 ? false : true;
  }
}
