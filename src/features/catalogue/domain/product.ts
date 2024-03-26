import { Entity, IEntity, IRoot } from "../../../core/entity";
import { ProductOptionId } from "./data/product-option-id";
import { ProductId } from "./data/product-id";
import { ProductOption } from "./entity/product-option";
import { IMoney } from "./data/price";
import { Prisma } from "../../../prisma/generated/client";
import {
  PayloadToResult,
  DefaultArgs,
  RenameAndNestPayloadKeys,
} from "../../../prisma/generated/client/runtime/library";
import { PrismaTypeMap, EntityType } from "../../../core/types";

export type IProductQuery = PrismaTypeMap<"Product">

// ICreateOnlyEntity,
// IEntity<ProductId>,

export interface IProduct
  extends EntityType<IProductQuery, ProductId, "createdAt" | "updatedAt"> {
  readonly productOptions:
    | readonly Readonly<ProductOption>[]
    | ReadonlyArray<Readonly<ProductOption>>;
}

export interface IProductRoot
  extends IRoot<Omit<IProduct, "createdAt" | "updatedAt">> {
  addOption(key: string, price: IMoney): void;
  removeOption(optionId: ProductOptionId, permanently: boolean): void;
  changeOptionKey(optionId: ProductOptionId, newKey: string): void;
  changeOptionPrice(optionId: ProductOptionId, value: IMoney): void;
}

export class Product
  extends Entity<ProductId>
  implements IProductRoot, IEntity<ProductId>
{
  private constructor(
    id: ProductId,
    public readonly name: string,
    public description: string | null,
    public isDraft: boolean,
    public productOptions: ProductOption[],
    isActive: boolean,
    public images: Media[]
  ) {
    super(id, isActive);
  }
  categories: DeepReadonlyArray<
    PayloadToResult<
      Prisma.$CategoryPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$CategoryPayload<DefaultArgs>>
    >
  >;
  productTags: DeepReadonlyArray<
    PayloadToResult<
      Prisma.$ProductTagPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$ProductTagPayload<DefaultArgs>>
    >
  >;
  productOption: DeepReadonlyArray<
    PayloadToResult<
      Prisma.$ProductOptionPayload<DefaultArgs>,
      RenameAndNestPayloadKeys<Prisma.$ProductOptionPayload<DefaultArgs>>
    >
  >;
  changeOptionPrice(optionId: ProductOptionId, value: IMoney): void {
    const option = this._getOption(optionId);
    this.removeOption(optionId, false);
    this.addOption(option.key, value);
  }

  // static retrieve(model: IProduct): IProductRoot | Readonly<IProductRoot> {
  //   return new Product(
  //     model.id,
  //     model.createdAt,
  //     model.title,
  //     model.isDraft,
  //     model.isActive,
  //     [...model.productOptions]
  //   );
  // }

  static create(title: string): IProductRoot | Readonly<IProductRoot> {
    return {} as any;
    // return new Product(ProductId.create(), new Date(), title, true, false, []) as any;
  }

  addOption(key: string, price: IMoney): void {
    this.productOptions.push(ProductOption.create(key, price));
  }

  private _getOption(optionId: ProductOptionId): ProductOption {
    const option = this.productOptions.find((option) =>
      option.id.compare(optionId)
    );
    if (!option) {
      throw new Error(`Option not found with id ${optionId}`);
    }

    return option;
  }
  removeOption(id: ProductOptionId, permanently: boolean): void {
    const option = this._getOption(id);

    if (permanently) {
      const optionIndex = this.productOptions.findIndex((o) => o.id == id);
      this.productOptions.splice(optionIndex, 1);
      return;
    }
    option.disable();
    option.isActive = false;
  }
  changeOptionKey(optionId: ProductOptionId, newKey: string) {
    const option = this._getOption(optionId);
    this.removeOption(optionId, false);
    this.addOption(newKey, option.price);
  }
}

// export interface ICategory extends ChangeIdType<PrismaCategory, CategoryId> {
//   readonly productIdentifiers: ProductId[];
// }
// export interface ITag extends ChangeIdType<PrismaTag, TagId> {}
// export interface IUser extends ChangeIdType<PrismaUser, UserId> {}
// export interface IOrder extends ChangeIdType<PrismaOrder, OrderId> {}
// export interface ILineItem extends ChangeIdType<PrismaLineItem, LineItemId> {}
// const p: DeepReadonly<RecursiveRequired<ChangeIdType<IProductBase,ProductId>>> ={ //RootType<IProductBase,ProductId,"createdAt" | "updatedAt"> = {

// }

// function removeProduct (){
//     if(Product.isDraft && !Orders.any(product.productOptions)) delete

//     else disable product then create new croduct same data
// }
