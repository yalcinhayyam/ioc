import { AbstractId, IValueObject } from "../../../../core/entity";
import { Guid } from "../../../../core/utilities/guid";

export class ProductOptionId extends AbstractId<Guid, "PRODUCT_OPTION_ID"> implements IValueObject {
    constructor(value: Guid) {
      super("PRODUCT_OPTION_ID", value);
    }
    static create() {
      return new ProductOptionId(Guid.generate());
    }
  }