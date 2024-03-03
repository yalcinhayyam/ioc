import { PrismaClient } from "../../../../prisma/generated/client";
import { IProductRepository } from "../../application/repositories/product";

export class ProductRepository implements IProductRepository {
  get() {
    return [
      { title: "First", complete: false },
      { title: "Second", complete: false },
      { title: "Third", complete: false },
    ];
  }
}

export class ProductPrismaRepository implements IProductRepository {
  constructor(private readonly _prisma: PrismaClient) {}
  get() {
    return this._prisma.product.findMany()
  }
}
