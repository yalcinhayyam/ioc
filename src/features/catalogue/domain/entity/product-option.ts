import { Entity, IEntity } from "../../../../core/entity";
import { ProductOptionId } from "../data/product-option-id";
import { IMoney } from "../data/price";
import { EntityType, PrismaTypeMap } from "../../../../core/types";

export type IProductOptionQuery = PrismaTypeMap<"ProductOption">;
export interface IProductOption
  extends EntityType<
    IProductOptionQuery,
    ProductOptionId,
    "createdAt" | "updatedAt" | "price"
  > {
  readonly price: IMoney;
}

export class ProductOption
  extends Entity<ProductOptionId>
  implements IEntity<ProductOptionId>
{
  private constructor(
    id: ProductOptionId,
    readonly key: string,
    readonly price: IMoney,
    isActive: boolean
  ) {
    super(id,  isActive);
  }

  static create(key: string, price: IMoney) {
    return new ProductOption(
      ProductOptionId.create(),
      key,
      price,
      true
    );
  }
}
