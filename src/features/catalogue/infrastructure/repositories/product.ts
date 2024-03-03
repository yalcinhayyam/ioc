import { Product as PrismaProduct, PrismaClient, Prisma, Category as PrismaCategory, Category } from "../../../../prisma/generated/client";
import { PayloadToResult } from "../../../../prisma/generated/client/runtime/library";
import { IProductRepository } from "../../application/repositories/product";
import { ProductId } from "../../domain/data/product-id";
import { Product } from "../../domain/product";
// import { IProductRoot, Product } from "../../domain/product";

export class ProductRepository implements IProductRepository {
  async get() {
    return [

    ];
  }
}


type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? RecursiveReadonly<T> :
  T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> { }

type RecursiveReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type RecursiveRequired<T> = Required<{
  [P in keyof T]: T[P] extends object | undefined ? RecursiveRequired<Required<T[P]>> : T[P];
}>;

type ChangeIdType<T, TId> = Omit<T, 'id'> & { id: TId };

// interface ICategory extends Omit<RecursiveReadonly<RecursiveRequired<PayloadToResult<Prisma.$CategoryPayload>>>, 'id'> {
//   id: CategoryId
// }
interface ICategory extends ChangeIdType<PrismaCategory, CategoryId> { }
interface IProduct extends ChangeIdType<PrismaCategory, ProductId> {
  categoryIdentifiers: CategoryId[]
}


// interface IProduct extends Omit<RecursiveReadonly<RecursiveRequired<PayloadToResult<Prisma.$ProductPayload>>>, 'id'> {
//   id: ProductId

// }

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly _prisma: PrismaClient) { }
  get(): Promise<Product> {
    const product = new (Product as unknown as new (...args: any[]) => RecursiveReadonly<RecursiveRequired<IProduct>>)()
    Object.assign(product,)
    return this._prisma.product.findFirst({
      include: {
      }
    })
  }
}
