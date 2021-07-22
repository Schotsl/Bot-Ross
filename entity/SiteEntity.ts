import BaseEntity from "./BaseEntity.ts";
import UserEntity from "./UserEntity.ts";

export default class SiteEntity extends BaseEntity {
  public url = ``;
  public title = ``;
  public owner: string | UserEntity = ``;
  public online = true;
  public status = false;
  public plausible = false;
}
