import { Client } from "https://deno.land/x/mysql/mod.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserMapper from "../mapper/UserMapper.ts";
import UserCollection from "../collection/UserCollection.ts";
import InterfaceRepository from "./RepositoryInterface.ts";

export default class UserRepository implements InterfaceRepository {
  private client: Client;
  private userMapper: UserMapper;

  constructor(client: Client) {
    this.client = client;
    this.userMapper = new UserMapper();
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<UserCollection> {
    // Get users from the database with the given offset and limit
    const rowsResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, created, updated, discord, firstname, lastname FROM users LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    // Count the total amount of users stored in the database
    const totalResult = await this.client.execute(
      `SELECT COUNT(uuid) AS total from users`,
    );

    // Map the database rows into a proper array of Users
    const rows = rowsResult.rows!;
    const total = totalResult.rows![0].total;
    return this.userMapper.mapCollection(rows, offset, limit, total);
  }

  public async getObject(uuid: string): Promise<UserEntity> {
    // Get the user from the database by its UUUUID
    const rowResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, created, updated, discord, firstname, lastname FROM users WHERE uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    // Map the database row into a single User object
    const row = rowResult.rows![0];
    return this.userMapper.mapObject(row);
  }

  public async addObject(object: UserEntity): Promise<UserEntity> {
    // Insert the user into the database
    await this.client.execute(
      `INSERT INTO users (uuid, firstname, lastname, discord) VALUES(UNHEX(REPLACE(?, '-', '')), ?, ?, ?);`,
      [object.uuid, object.firstname, object.lastname, object.discord],
    );

    // Fetch the object from the database to get the TIMESTAMPs
    return await this.getObject(object.uuid);
  }

  // TODO: Implement updateObject

  public async removeObject(uuid: string): Promise<boolean> {
    // Delete the user from the database by its UUUUID
    const deleteResult = await this.client.execute(
      `DELETE FROM users WHERE uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    // Simplify the result to a boolean
    return deleteResult.affectedRows === 0 ? false : true;
  }
}
