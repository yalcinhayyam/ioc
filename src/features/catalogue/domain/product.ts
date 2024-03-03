import {
  Entity,
  ICreateOnlyEntity,
  IEntity,
  IRoot,
} from "../../../core/entity";
import { OptionId } from "./data/option-id";
import { ProductId } from "./data/product-id";
import { Option } from "./entity/option";
import { IMoney } from "./data/price";

export interface IProduct extends ICreateOnlyEntity, IEntity<ProductId> {
  readonly isDraft: boolean;
  readonly title: string;
  readonly options:
    | readonly Readonly<Option>[]
    | ReadonlyArray<Readonly<Option>>;
}

interface IProductRoot extends IRoot<IProduct> {
  addOption(key: string, price: IMoney): void;
  removeOption(optionId: OptionId, permanently: boolean): void;
  changeOptionKey(optionId: OptionId, newKey: string): void;
  changeOptionPrice(optionId: OptionId, value: IMoney): void;
}

class Product
  extends Entity<ProductId>
  implements IProductRoot, IEntity<ProductId>
{
  private constructor(
    id: ProductId,
    createdAt: Date,
    public readonly title: string,
    public isDraft: boolean,
    isActive: boolean,
    public readonly options: Option[]
  ) {
    super(id, createdAt, isActive);
  }
  changeOptionPrice(optionId: OptionId, value: IMoney): void {
    const option = this._getOption(optionId);
    this.removeOption(optionId, false);
    this.addOption(option.key, value);
  }

  static retrieve(model: IProduct): IProductRoot | Readonly<IProductRoot> {
    return new Product(
      model.id,
      model.createdAt,
      model.title,
      model.isDraft,
      model.isActive,
      [...model.options]
    );
  }

  static create(title: string): IProductRoot | Readonly<IProductRoot> {
    return new Product(ProductId.create(), new Date(), title, true, false, []);
  }

  addOption(key: string, price: IMoney): void {
    this.options.push(Option.create(key, price));
  }

  private _getOption(optionId: OptionId): Option {
    const option = this.options.find((option) => option.id.compare(optionId));
    if (!option) {
      throw new Error(`Option not found with id ${optionId}`);
    }

    return option;
  }
  removeOption(id: OptionId, permanently: boolean): void {
    const option = this._getOption(id);

    if (permanently) {
      const optionIndex = this.options.findIndex((o) => o.id == id);
      this.options.splice(optionIndex, 1);
      return;
    }
    option.disable();
    option.isActive = false;
  }
  changeOptionKey(optionId: OptionId, newKey: string) {
    const option = this._getOption(optionId);
    this.removeOption(optionId, false);
    this.addOption(newKey, option.price);
  }
}

// function removeProduct (){
//     if(Product.isDraft && !Orders.any(product.options)) delete

//     else disable product then create new croduct same data
// }
