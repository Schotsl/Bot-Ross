import BaseEntity from "./BaseEntity.ts";
import ContactEntity from "./ContactEntity.ts";

export default class StakeEntity extends BaseEntity {
  public part = 1;
  public contact: string | ContactEntity = ``;
}
