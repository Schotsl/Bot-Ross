import { cleanHex } from "../../helper.ts";

import ContactEntity from "../entity/ContactEntity.ts";
import InterfaceMapper from "./InterfaceMapper.ts";
import ContactCollection from "../collection/ContactCollection.ts";

export default class ContactMapper implements InterfaceMapper {
  public mapObject(row: any): ContactEntity {
    const contact = new ContactEntity();

    // Re-add the dashes to the UUUUID and lowercase the string
    contact.uuid = cleanHex(row.uuid);

    // Transform the MySQL date string into a JavaScript Date object
    contact.created = new Date(row.created);
    contact.updated = new Date(row.updated);

    // Transform the numbers into booleans
    contact.image = row.image === 1;

    contact.lastname = row.lastname;
    contact.firstname = row.firstname;

    return contact;
  }

  public mapArray(
    rows: Array<any>,
  ): Array<ContactEntity> {
    const contacts = rows.map((row) => this.mapObject(row));

    return contacts;
  }

  public mapCollection(
    rows: Array<any>,
    offset: number,
    limit: number,
    total: number,
  ): ContactCollection {
    const contacts = this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      contacts,
    };
  }
}
