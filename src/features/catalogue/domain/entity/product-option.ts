import { Entity, IEntity } from "../../../../core/entity";
import { ProductOptionId } from "../data/product-option-id";
import { IMoney } from "../data/price";

export interface IProductOption extends IEntity<ProductOptionId> {
  readonly key: string;
  readonly price: IMoney;
  isActive: boolean;
}

export class ProductOption extends Entity<ProductOptionId> implements IEntity<ProductOptionId> {
  private constructor(
    id: ProductOptionId,
    createdAt: Date,
    readonly key: string,
    readonly price: IMoney,
    isActive: boolean
  ) {
    super(id, createdAt, isActive);
  }

  static create(key: string, price: IMoney) {
    return new ProductOption(ProductOptionId.create(), new Date(), key, price, true);
  }
}
