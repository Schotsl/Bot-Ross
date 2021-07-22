import { Client } from "https://deno.land/x/mysql/mod.ts";

import SiteEntity from "../entity/SiteEntity.ts";
import SiteMapper from "../mapper/SiteMapper.ts";
import SiteCollection from "../collection/SiteCollection.ts";
import InterfaceRepository from "./RepositoryInterface.ts";

export default class SiteRepository implements InterfaceRepository {
  private client: Client;
  private siteMapper: SiteMapper;

  constructor(client: Client) {
    this.client = client;
    this.siteMapper = new SiteMapper(client);
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<SiteCollection> {
    // Get sites from the database with the given offset and limit
    const rowsResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, HEX(owner) AS owner, created, updated, url, title, online, status, plausible FROM sites LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    // Count the total amount of sites stored in the database
    const totalResult = await this.client.execute(
      `SELECT COUNT(uuid) AS total from sites`,
    );

    // Map the database rows into a proper array of Sites
    const rows = rowsResult.rows!;
    const total = totalResult.rows![0].total;
    return this.siteMapper.mapCollection(rows, offset, limit, total);
  }

  public async getObject(uuid: string): Promise<SiteEntity> {
    // Get the site from the database by its UUUUID
    const rowResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, HEX(owner) AS owner, created, updated, url, title, online, status, plausible FROM sites WHERE uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    // Map the database row into a single Site object
    const row = rowResult.rows![0];
    return this.siteMapper.mapObject(row);
  }

  // TODO: Bind the owner property to prevent MySQL injection

  public async addObject(object: SiteEntity): Promise<SiteEntity> {
    // Insert the site into the database
    await this.client.execute(
      `INSERT INTO sites (uuid, owner, url, title, online, status, plausible) VALUES(UNHEX(REPLACE(?, '-', '')), UNHEX(REPLACE('${object.owner}', '-', '')), ?, ?, ?, ?);`,
      [
        object.uuid,
        object.url,
        object.title,
        object.online,
        object.status,
        object.plausible,
      ],
    );

    // Fetch the object from the database to get the TIMESTAMPs
    return await this.getObject(object.uuid);
  }

  public async updateObject(object: SiteEntity): Promise<SiteEntity> {
    // TODO: Detect wheter owner property is a string or object
    // TODO: Bind properties

    // Update the site in the database
    await this.client.execute(
      `UPDATE \`bot-ross\`.sites SET owner=UNHEX(REPLACE('${object.owner}', '-', '')), url='${object.url}', title='${object.title}', status=${object.status}, plausible=${object.plausible}, online=${object.online} WHERE uuid=UNHEX(REPLACE('${object.uuid}', '-', ''))`,
    );

    // Fetch the object from the database to get the TIMESTAMPs
    return await this.getObject(object.uuid);
  }

  public async removeObject(uuid: string): Promise<boolean> {
    // Delete the site from the database by its UUUUID
    const deleteResult = await this.client.execute(
      `DELETE FROM sites WHERE uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    // Simplify the result to a boolean
    return deleteResult.affectedRows === 0 ? false : true;
  }
}
