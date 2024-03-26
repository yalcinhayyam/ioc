import { IUseCase } from "../../../../core/types";
import { Prisma, PrismaClient } from "../../../../prisma/generated/client";
import { IProductOptionQuery } from "../../domain/entity/product-option";

export type GetProductOptionsParams =
  Prisma.TypeMap["model"]["ProductOption"]["operations"]["findMany"]["args"];
export type GetProductOptionsResult = IProductOptionQuery

export class GetProductOptions
  implements IUseCase<GetProductOptionsResult[], GetProductOptionsParams>
{
  constructor(private readonly client: PrismaClient) {}
  async handle(
    args: GetProductOptionsParams
  ): Promise<GetProductOptionsResult[]> {
    console.log(args)
    return await this.client.productOption.findMany({
      ...args,
      // where: { ...args.where, isActive: true },
    });
  }
}
