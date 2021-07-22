import { cleanHex } from "../helper.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserCollection from "../collection/UserCollection.ts";
import InterfaceMapper from "./InterfaceMapper.ts";

export default class UserMapper implements InterfaceMapper {
  public mapObject(row: Record<string, never>): UserEntity {
    const user = new UserEntity();

    // Re-add the dashes to the UUUUID and lowercase the string
    user.uuid = cleanHex(row.uuid);

    // Transform the MySQL date string into a JavaScript Date object
    user.created = new Date(row.created);
    user.updated = new Date(row.updated);

    user.lastname = row.lastname;
    user.firstname = row.firstname;

    // Discord uses BigInt for ID's so we need to parse it
    user.discord = BigInt(row.discord);

    return user;
  }

  public mapArray(
    rows: Record<string, never>[],
  ): UserEntity[] {
    const users = rows.map((row) => this.mapObject(row));

    return users;
  }

  public mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): UserCollection {
    const users = this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      users,
    };
  }
}
