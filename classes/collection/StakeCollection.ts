import StakeEntity from "../entity/StakeEntity.ts";
import BaseCollection from "./BaseCollection.ts";

export default class ContactCollection extends BaseCollection {
  public stakes: Array<StakeEntity> = [];
}
