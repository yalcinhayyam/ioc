import { IUseCase } from "../../../../core/types";
import { PrismaClient } from "../../../../prisma/generated/client";
import { IProduct, IProductQuery, Product } from "../../domain/product";

export type CreateProductParams = {};
export type CreateProductResult = IProduct;

export class CreateProduct
  implements IUseCase<CreateProductResult, CreateProductParams>
{
  constructor(private readonly client: PrismaClient) {}
  async handle(args: CreateProductParams): Promise<CreateProductResult> {
    return Product.create() as any;
  }
}

// const s: GetProductItemsParams["select"] = {};
// const c: GetProductItemsResult[0] = {};
