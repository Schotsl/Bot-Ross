import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";

import TaxonomyEntity from "../entity/TaxonomyEntity.ts";
import TaxonomyMapper from "../mapper/TaxonomyMapper.ts";
import TaxonomyCollection from "../collection/TaxonomyCollection.ts";
import InterfaceRepository from "./RepositoryInterface.ts";

export default class TaxonomyRepository implements InterfaceRepository {
  private taxonomyMapper: TaxonomyMapper;
  private client: Client;

  constructor(client: Client) {
    this.client = client;

    this.taxonomyMapper = new TaxonomyMapper();
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<TaxonomyCollection> {
    // Get taxonomies from the database with the given offset and limit
    const rowsResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, created, updated, title FROM taxonomy LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    // Count the total amount of taxonomies stored in the database
    const totalResult = await this.client.execute(
      `SELECT COUNT(uuid) AS total from taxonomy`,
    );

    // Map the database rows into a proper array of Taxonomies
    const rows = rowsResult.rows!;
    const total = totalResult.rows![0].total;
    return this.taxonomyMapper.mapCollection(rows, offset, limit, total);
  }

  public async getObject(uuid: string): Promise<TaxonomyEntity> {
    // Get the taxonomy from the database by its UUID
    const rowResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, created, updated, title FROM taxonomy WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Map the database row into a single Taxonomy object
    const row = rowResult.rows![0];
    return this.taxonomyMapper.mapObject(row);
  }

  public async getObjectByExpense(uuid: string): Promise<TaxonomyEntity> {
    // Get the taxonomy from the database by its UUID stored in the expense table
    const rowResult = await this.client.execute(
      `SELECT HEX(taxonomy.uuid) AS uuid, taxonomy.created, taxonomy.updated, taxonomy.title FROM taxonomy INNER JOIN expense ON taxonomy.uuid = expense.taxonomy WHERE expense.uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Map the database row into a single Taxonomy object
    const row = rowResult.rows![0];
    return this.taxonomyMapper.mapObject(row);
  }

  public async addObject(taxonomy: TaxonomyEntity): Promise<TaxonomyEntity> {
    // Insert the taxonomy into the database
    await this.client.execute(
      // `INSERT INTO taxonomy (uuid, title) VALUES(UNHEX(REPLACE('${taxonomy.uuid}', '-', '')), '${taxonomy.title}')`,
      `INSERT INTO taxonomy (uuid, title) VALUES(UNHEX(?), ?)`,
      [ "2467f394f84247368d88a4fa321ae55c", "foo" ]
    );

    // Fetch the object from the database and map it
    return await this.getObject(taxonomy.uuid);
  }

  public async removeObject(uuid: string): Promise<boolean> {
    // Delete the taxonomy from the database by its UUID
    const deleteResult = await this.client.execute(
      `DELETE FROM taxonomy WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Simplify the result to a boolean
    return deleteResult.affectedRows === 0 ? false : true;
  }
}
