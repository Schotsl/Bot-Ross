import SiteEntity from "../entity/SiteEntity.ts";
import BaseCollection from "./BaseCollection.ts";

export default class SiteCollection extends BaseCollection {
  public sites: SiteEntity[] = [];
}
