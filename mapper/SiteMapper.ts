import { Client } from "https://deno.land/x/mysql/mod.ts";
import { cleanHex } from "../helper.ts";

import SiteEntity from "../entity/SiteEntity.ts";
import SiteCollection from "../collection/SiteCollection.ts";
import UserRepository from "../repository/UserRepository.ts";
import InterfaceMapper from "./InterfaceMapper.ts";

export default class SiteMapper implements InterfaceMapper {
  private userRepository: UserRepository;

  constructor(client: Client) {
    this.userRepository = new UserRepository(client);
  }

  public async mapObject(row: Record<string, never>): Promise<SiteEntity> {
    const site = new SiteEntity();

    // Re-add the dashes to the UUUUID and lowercase the string
    site.uuid = cleanHex(row.uuid);

    // Transform the MySQL date string into a JavaScript Date object
    site.created = new Date(row.created);
    site.updated = new Date(row.updated);

    // Transform the numbers into booleans
    site.online = row.online === 1;
    site.status = row.status === 1;
    site.plausible = row.plausible === 1;

    site.url = row.url;
    site.title = row.title;

    // Fetch the owners User object
    const uuid = cleanHex(row.owner);
    const owner = await this.userRepository.getObject(uuid);

    site.owner = owner;

    return site;
  }

  public async mapArray(
    rows: Record<string, never>[],
  ): Promise<SiteEntity[]> {
    const sites = await Promise.all(rows.map((row) => this.mapObject(row)));

    return sites;
  }

  public async mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): Promise<SiteCollection> {
    const sites = await this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      sites,
    };
  }
}
