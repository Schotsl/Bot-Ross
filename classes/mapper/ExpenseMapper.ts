import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { cleanHex } from "../../helper.ts";

import ExpenseEntity from "../entity/ExpenseEntity.ts";
import InterfaceMapper from "./InterfaceMapper.ts";
import ExpenseCollection from "../collection/ExpenseCollection.ts";
import ContactRepository from "../repository/ContactRepository.ts";
import TaxonomyRepository from "../repository/TaxonomyRepository.ts";

export default class ExpenseMapper implements InterfaceMapper {
  private contactRepository: ContactRepository;
  private taxonomyRepository: TaxonomyRepository;

  constructor(client: Client) {
    this.contactRepository = new ContactRepository(client);
    this.taxonomyRepository = new TaxonomyRepository(client);
  }

  public async mapObject(row: any): Promise<ExpenseEntity> {
    const expense = new ExpenseEntity();

    // Re-add the dashes to the UUUUID and lowercase the string
    expense.uuid = cleanHex(row.uuid);

    // Transform the MySQL date string into a JavaScript Date object
    expense.date = new Date(row.date);
    expense.created = new Date(row.created);
    expense.updated = new Date(row.updated);

    expense.title = row.title;
    expense.amount = Number(row.amount);
    expense.description = row.description;

    // Transform the numbers into booleans
    expense.optional = row.optional === 1;
    expense.compensated = row.compensated === 1;

    // Fetch the taxonomy and contacts and await it in parallel
    const results = await Promise.all([
      this.taxonomyRepository.getObjectByExpense(cleanHex(expense.uuid)),
      // this.contactRepository.getArrayByExpense(cleanHex(expense.uuid)),
    ]);

    expense.taxonomy = results[0];
    // expense.contacts = results[1];

    return expense;
  }

  public async mapArray(
    rows: Array<any>,
  ): Promise<Array<ExpenseEntity>> {
    const expenses = await Promise.all(rows.map((row) => this.mapObject(row)));

    return expenses;
  }

  public async mapCollection(
    rows: Array<any>,
    offset: number,
    limit: number,
    total: number,
  ): Promise<ExpenseCollection> {
    const expenses = await this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      expenses,
    };
  }
}
