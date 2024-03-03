import { AbstractId, IValueObject } from "../../../../core/entity";
import { Guid } from "../../../../core/utilities/guid";

export class ProductId extends AbstractId<Guid, "PRODUCT_ID"> implements IValueObject  {
    constructor(value: Guid) {
      super("PRODUCT_ID", value);
    }
    static create() {
      return new ProductId(Guid.generate());
    }
  }
  