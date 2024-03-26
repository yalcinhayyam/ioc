import { BaseContext } from "@apollo/server";
import { Prisma } from "../prisma/generated/client";

export interface IUseCase<Type, Args> {
  handle(args: Args): Promise<Type>;
}

export interface IUseCasePipeline<Type, Args> {
  handle(args: Args, next: () => Promise<Type>): Promise<Type>;
}

type Constructor<T> = new (container: T) => T;
export type Callable<Type, Args> = (args: Args) => Promise<Type>;

export type InjectionToken<T = any> = string; //| Constructor<T>;

export interface IInjectorCollection<TContainer> {
  get container(): TContainer;
  register<T>(token: InjectionToken<T>, value: T): void;
  resolve<T>(token: InjectionToken<T>): T;
  Inject(token: InjectionToken): Function;
  Injectable(): Function;
}

export interface IInjector {
  service<T>(token: InjectionToken<T>): T;
  useCase<Type, Args>(token: InjectionToken<Type>): Callable<Type, Args>;
}

export type PrismaTypeMap<M extends keyof Prisma.TypeMap["model"]> =
  Prisma.TypeMap["model"][M]["operations"]["findMany"]["result"][number];
// &  NonNullable<{
//     id: any;
//   }>;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type RecursiveReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
  ? T
  : T extends object
  ? RecursiveReadonly<T>
  : T;

export type RecursiveRequired<T> = Required<{
  [P in keyof T]: T[P] extends object
    ? RecursiveRequired<Required<T[P]>>
    : T[P];
}>;

export type ChangeIdType<T, TId> = Omit<T, "id"> & { id: TId };

export type EntityType<Model, TId, O extends string> = Omit<
  DeepReadonly<RecursiveRequired<ChangeIdType<NonNullable<Model>, TId>>>,
  O
>;

export type INode<T> = { [K in keyof T]?: T[K] } & { id: string };

export interface ICursor {
  value: string;
}

export interface IConnection<T> {
  edges: IEdge<T>[];
  pageInfo: IPageInfo;
}

export interface IEdge<T> {
  cursor: ICursor;
  node: INode<T>;
}

export interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: ICursor;
  endCursor?: ICursor;
}

export type Projection<T> = {
  select: {
    [key in keyof T]: T[key] extends Array<infer U>
      ? U extends object
        ? Projection<U>
        : boolean
      : T[key] extends object
      ? Projection<T[key]>
      : boolean;
  };
};

export type Context = {
  injector: IInjector;
} & BaseContext;
