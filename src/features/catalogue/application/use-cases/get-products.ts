import { IUseCase } from "../../../../core/types";
import { Prisma, PrismaClient } from "../../../../prisma/generated/client";
import { IProductQuery } from "../../domain/product";

export type GetProductsParams =
  Prisma.TypeMap["model"]["Product"]["operations"]["findMany"]["args"];
export type GetProductsResult = IProductQuery;

export class GetProducts
  implements IUseCase<GetProductsResult[], GetProductsParams>
{
  constructor(private readonly client: PrismaClient) {}
  async handle(args: GetProductsParams): Promise<GetProductsResult[]> {
    console.log(args)

    return await this.client.product.findMany({
      ...args,
      // where: { ...args.where, isActive: true },
    });
  }
}
