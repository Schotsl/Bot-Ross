import ContactEntity from "../entity/ContactEntity.ts";
import BaseCollection from "./BaseCollection.ts";

export default class ContactCollection extends BaseCollection {
  public contacts: Array<ContactEntity> = [];
}
