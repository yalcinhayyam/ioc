import { Guid } from "./utilities/guid";
import { UniqueType } from "./utilities/unique-type";

export interface ICreateOnlyEntity {
  readonly createdAt: Date;
}
export interface IEntity<TId extends AbstractId<unknown, any>> {
  readonly id: TId;
  readonly isActive: boolean;
}

export type IRoot<T> = T;

export interface IValueObject {}

export abstract class AbstractId<T, H extends string> extends UniqueType<H> {
  constructor(hashCode: H, public readonly value: T) {
    super(hashCode);
  }
}

export abstract class Entity<TId extends AbstractId<unknown, any>> implements ICreateOnlyEntity, IEntity<TId> {
  constructor(
    public readonly id: TId,
    public readonly createdAt: Date,
    public isActive: boolean
  ) {}
  disable(): void {
    throw new Error("Method not implemented.");
  }
  enable(): void {
    throw new Error("Method not implemented.");
  }
}

// export abstract class BaseRoot<T> {}
