import { Entity, IEntity } from "../../../../core/entity";
import { OptionId } from "../data/option-id";
import { IMoney } from "../data/price";

export interface IOption extends IEntity<OptionId> {
  readonly key: string;
  readonly price: IMoney;
  isActive: boolean;
}

export class Option extends Entity<OptionId> implements IEntity<OptionId> {
  private constructor(
    id: OptionId,
    createdAt: Date,
    readonly key: string,
    readonly price: IMoney,
    isActive: boolean
  ) {
    super(id, createdAt, isActive);
  }

  static create(key: string, price: IMoney) {
    return new Option(OptionId.create(), new Date(), key, price, true);
  }
}
