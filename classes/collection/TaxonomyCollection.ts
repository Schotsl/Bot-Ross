import TaxonomyEntity from "../entity/TaxonomyEntity.ts";
import BaseCollection from "./BaseCollection.ts";

export default class TaxonomyCollection extends BaseCollection {
  public taxonomies: Array<TaxonomyEntity> = [];
}
