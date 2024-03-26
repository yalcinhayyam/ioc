import {
  IConnection,
  INode,
  IUseCase,
  Projection,
} from "../../../../core/types";
import { Inject, Injectable } from "../../../../di";
import {
  Arg,
  Args,
  Authorized,
  Field,
  FieldResolver,
  Info,
  InputType,
  MiddlewareFn,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import {
  GetProducts,
  GetProductsParams,
  GetProductsResult,
} from "../../application/use-cases";

import {
  CreateQuery,
  QueryParams,
  fieldSelector,
} from "../../../../core/utilities/graphql/field-selector";
import { Cursor } from "../../../../core/utilities/graphql/scalars";
import { paginator } from "../../../../core/utilities/graphql/paginator";
import {
  CREATE_PRODUCT_HANDLER,
  CREATE_QUERY,
  GET_PRODUCTS_HANDLER,
  GET_PRODUCT_OPTIONS_HANDLER,
} from "../../constants";
import {
  GenerateEdgeType,
  Paginate,
} from "../../../../core/utilities/graphql/connection-type-factory";
import {
  CreateProductParams,
  CreateProductResult,
} from "../../application/use-cases/create-product";
import { IProductOptionQuery } from "../../domain/entity/product-option";
import {
  GetProductOptionsParams,
  GetProductOptionsResult,
} from "../../application/use-cases/get-product-options";
import { IProductQuery } from "../../domain/product";
import { Prisma, PrismaClient } from "../../../../prisma/generated/client";

@ObjectType()
class Product {
  //implements Required<GetProductItemsResult>{
  @Field()
  id!: string;

  @Field()
  // @Authorized()
  name!: string;

  // @Field((of) => [ProductOption])
  // options!: IProductOptionQuery[];
}

@ObjectType()
class ProductOption {
  @Field()
  id!: string;
  @Field()
  code!: string;
}

@InputType()
class CreateProductInput {}

@ObjectType()
class CreateProductPayload {}

@ObjectType()
class ProductOptionNode extends ProductOption implements INode<ProductOption> {}
@ObjectType()
class ProductOptionEdge extends GenerateEdgeType(ProductOptionNode) {}
@ObjectType()
class ProductOptionConnection extends Paginate(ProductOptionEdge) {}

@ObjectType()
class ProductNode extends Product implements INode<Product> {}
@ObjectType()
class ProductEdge extends GenerateEdgeType(ProductNode) {}
@ObjectType()
class ProductConnection extends Paginate(ProductEdge) {}

// export const ExecutePrismaQuery =
//   <
//     T extends Prisma.TypeMap["meta"]["modelProps"],
//     M extends keyof Prisma.TypeMap["model"]
//   >(
//     model: T
//   ): MiddlewareFn =>
//   async ({ info }, next) => {
//     const result = (await next()) as Promise<
//       Prisma.TypeMap["model"][M]["operations"]["findMany"]["args"]
//     >;
//     console.log(result);
//     return ((await new PrismaClient()[model]).findMany as unknown as Function)(
//       result
//     );
//   };

@Resolver((of) => Product)
@Injectable()
export class ProductResolver {
  constructor(
    @Inject(CREATE_QUERY) private readonly createQuery: CreateQuery<any>,
    @Inject(GET_PRODUCTS_HANDLER)
    private readonly getProducts: IUseCase<
      GetProductsResult[],
      GetProductsParams
    >,
    @Inject(GET_PRODUCT_OPTIONS_HANDLER)
    private readonly getProductOptions: IUseCase<
      GetProductOptionsResult[],
      GetProductOptionsParams
    > //   CreateProductParams // @Inject(CREATE_PRODUCT_HANDLER) // private readonly createProduct: IUseCase< //   CreateProductResult, // >
  ) {}
  @Query((of) => ProductConnection)
  // @UseMiddleware([ExecutePrismaQuery("product")])
  async products(
    @Info() info: any,
    @Arg("first") first: number,
    @Arg("after", { nullable: true }) after?: Cursor
    // @Arg("first") orderBy: 'asc'
  ) {
    const fields = fieldSelector<IProductQuery>(info);
    const result = await this.getProducts.handle({
      ...(await this.createQuery({
        first,
        after,
        orderBy: "asc",
        fields: {
          ...fields,
          select: { ...fields.select, options: false },
        } satisfies Projection<IProductQuery>,
      })),
    });
    console.log(result)
    return paginator(result, [first, after]) as any;
  }

  @FieldResolver((of) => ProductOptionConnection)
  async options(
    @Root() product: IProductOptionQuery,
    @Info() info: any,
    @Arg("first") first: number,
    @Arg("after", { nullable: true }) after?: Cursor
  ) {
    const result = await this.getProductOptions.handle({
      where: {
        productId: product.id,
      },
      ...(await this.createQuery({
        first,
        after,
        orderBy: "asc",
        fields: fieldSelector(info),
      })),
    });
    // console.log(result)

    return paginator(result, [first, after]);
  }

  // @Mutation()
  // async createProduct(
  //   input: CreateProductInput
  // ): Promise<CreateProductPayload> {}
}
