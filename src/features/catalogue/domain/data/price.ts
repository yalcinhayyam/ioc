import { IValueObject } from "../../../../core/entity";

export interface IMoney extends IValueObject {
  readonly currency: string;
  readonly amount: number;
}
export function MoneyClass(): new (currency: string, amount: number) => IMoney {
  return class implements IMoney {
    constructor(
      public readonly currency: string,
      public readonly amount: number
    ) {}
  };
}

function MoneyInstance(currency: string, amount: number): IMoney {
  return new (class implements IMoney {
    constructor(
      public readonly currency: string,
      public readonly amount: number
    ) {}
  })(currency, amount);
}

function Money(currency: string, amount: number): IMoney {
  return new (class implements IMoney {
    constructor(
      public readonly currency: string,
      public readonly amount: number
    ) {}
  })(currency, amount);
}
