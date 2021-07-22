import BaseEntity from "./BaseEntity.ts";

export default class UserEntity extends BaseEntity {
  public discord = BigInt(0);
  public lastname = ``;
  public firstname = ``;
}
