import ExpenseEntity from "../entity/ExpenseEntity.ts";
import BaseCollection from "./BaseCollection.ts";

export default class ExpenseCollection extends BaseCollection {
  public expenses: Array<ExpenseEntity> = [];
}
