import { cleanHex } from "../../helper.ts";

import TaxonomyEntity from "../entity/TaxonomyEntity.ts";
import InterfaceMapper from "./InterfaceMapper.ts";
import TaxonomyCollection from "../collection/TaxonomyCollection.ts";

export default class TaxonomyMapper implements InterfaceMapper {
  public mapObject(row: any): TaxonomyEntity {
    const taxonomy = new TaxonomyEntity();

    // Re-add the dashes to the UUUUID and lowercase the string
    taxonomy.uuid = cleanHex(row.uuid);

    // Transform the MySQL date string into a JavaScript Date object
    taxonomy.created = new Date(row.created);
    taxonomy.updated = new Date(row.updated);

    taxonomy.title = row.title;

    return taxonomy;
  }

  public mapArray(
    rows: Array<any>,
  ): Array<TaxonomyEntity> {
    const taxonomies = rows.map((row) => this.mapObject(row));

    return taxonomies;
  }

  public mapCollection(
    rows: Array<any>,
    offset: number,
    limit: number,
    total: number,
  ): TaxonomyCollection {
    const taxonomies = this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      taxonomies,
    };
  }
}
