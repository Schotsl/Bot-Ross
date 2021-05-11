import { Client } from "https://deno.land/x/mysql/mod.ts";

import ContactEntity from "../entity/ContactEntity.ts";
import ContactMapper from "../mapper/ContactMapper.ts";
import ContactCollection from "../collection/ContactCollection.ts";
import InterfaceRepository from "./RepositoryInterface.ts";

export default class ContactRepository implements InterfaceRepository {
  private contactMapper: ContactMapper;
  private client: Client;

  constructor(client: Client) {
    this.client = client;

    this.contactMapper = new ContactMapper();
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<ContactCollection> {
    // Get contacts from the database with the given offset and limit
    const rowsResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, created, updated, image, firstname, lastname FROM contact LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    // Count the total amount of contacts stored in the database
    const totalResult = await this.client.execute(
      `SELECT COUNT(uuid) AS total from contact`,
    );

    // Map the database rows into a proper array of Contacts
    const rows = rowsResult.rows!;
    const total = totalResult.rows![0].total;
    return this.contactMapper.mapCollection(rows, offset, limit, total);
  }

  public async getObject(uuid: string): Promise<ContactEntity> {
    // Get the contact from the database by its UUUUID
    const rowResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, created, updated, image, firstname, lastname FROM contact WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Map the database row into a single Contact object
    const row = rowResult.rows![0];
    return this.contactMapper.mapObject(row);
  }

  public async addObject(object: ContactEntity): Promise<ContactEntity> {
    // Insert the contact into the database
    await this.client.execute(
      `INSERT INTO contact (uuid, firstname, lastname, image) VALUES(UNHEX(REPLACE('${object.uuid}', '-', '')), '${object.firstname}', '${object.lastname}', ${object.image});`,
    );

    // Fetch the object from the database to get the TIMESTAMPs
    return await this.getObject(object.uuid);
  }

  public async removeObject(uuid: string): Promise<boolean> {
    // Delete the contact from the database by its UUUUID
    const deleteResult = await this.client.execute(
      `DELETE FROM contact WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Simplify the result to a boolean
    return deleteResult.affectedRows === 0 ? false : true;
  }
}
