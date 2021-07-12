import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { cleanHex } from "../../helper.ts";

import StakeEntity from "../entity/StakeEntity.ts";
import InterfaceMapper from "./InterfaceMapper.ts";
import StakeCollection from "../collection/ExpenseCollection.ts";
import ContactRepository from "../repository/ContactRepository.ts";

export default class ExpenseMapper implements InterfaceMapper {
  private contactRepository: ContactRepository;

  constructor(client: Client) {
    this.contactRepository = new ContactRepository(client);
  }

  public async mapObject(row: any): Promise<StakeEntity> {
    const stake = new StakeEntity();

    // Transform the MySQL date string into a JavaScript Date object
    stake.created = new Date(row.created);
    stake.updated = new Date(row.updated);

    stake.part = row.part;

    // Fetch the contact
    stake.contact = await this.contactRepository.getObject(cleanHex(row.contact));

    return stake;
  }

  public async mapArray(
    rows: Array<any>,
  ): Promise<Array<StakeEntity>> {
    const stakes = await Promise.all(rows.map((row) => this.mapObject(row)));

    return stakes;
  }

  public async mapCollection(
    rows: Array<any>,
    offset: number,
    limit: number,
    total: number,
  ): Promise<StakeCollection> {
    const stakes = await this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      stakes,
    };
  }
}
