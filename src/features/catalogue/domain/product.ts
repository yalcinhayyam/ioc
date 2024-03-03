import {
  Entity,
  ICreateOnlyEntity,
  IEntity,
  IRoot,
} from "../../../core/entity";
import { ProductOptionId } from "./data/product-option-id";
import { ProductId } from "./data/product-id";
import { ProductOption } from "./entity/product-option";
import { IMoney } from "./data/price";

interface IProduct extends ICreateOnlyEntity, IEntity<ProductId> {
  readonly isDraft: boolean;
  readonly title: string;
  readonly options:
    | readonly Readonly<ProductOption>[]
    | ReadonlyArray<Readonly<ProductOption>>;
}

export interface IProductRoot extends IRoot<IProduct> {
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
    createdAt: Date,
    public readonly title: string,
    public isDraft: boolean,
    isActive: boolean,
    public readonly options: ProductOption[]
  ) {
    super(id, createdAt, isActive);
  }
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
  //     [...model.options]
  //   );
  // }

  static create(title: string): IProductRoot | Readonly<IProductRoot> {
    return new Product(ProductId.create(), new Date(), title, true, false, []);
  }

  addOption(key: string, price: IMoney): void {
    this.options.push(ProductOption.create(key, price));
  }

  private _getOption(optionId: ProductOptionId): ProductOption {
    const option = this.options.find((option) => option.id.compare(optionId));
    if (!option) {
      throw new Error(`Option not found with id ${optionId}`);
    }

    return option;
  }
  removeOption(id: ProductOptionId, permanently: boolean): void {
    const option = this._getOption(id);

    if (permanently) {
      const optionIndex = this.options.findIndex((o) => o.id == id);
      this.options.splice(optionIndex, 1);
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

// function removeProduct (){
//     if(Product.isDraft && !Orders.any(product.options)) delete

//     else disable product then create new croduct same data
// }
