import { AbstractId, IValueObject } from "../../../../core/entity";
import { Guid } from "../../../../core/utilities/guid";

export class OptionId extends AbstractId<Guid, "OPTION_ID"> implements IValueObject {
    constructor(value: Guid) {
      super("OPTION_ID", value);
    }
    static create() {
      return new OptionId(Guid.generate());
    }
  }