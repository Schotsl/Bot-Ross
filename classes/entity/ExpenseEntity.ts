import BaseEntity from "./BaseEntity.ts";
import StakeEntity from "./StakeEntity.ts";
import TaxonomyEntity from "./TaxonomyEntity.ts";

export default class ExpenseEntity extends BaseEntity {
  public date = new Date();
  public title = ``;
  public amount = 0;
  public optional = false;
  public description = ``;
  public compensated = false;

  public stakes: Array<StakeEntity> = [];
  public taxonomy: string | TaxonomyEntity = ``;
}
