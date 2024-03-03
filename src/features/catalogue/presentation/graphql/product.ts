import { IUseCase } from "../../../../core/types";
import { Inject, Injectable } from "../../../../di";
import { Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class Product {
  @Field()
  title!: string;

  @Field()
  complete!: boolean;
}

@Resolver()
@Injectable()
export class ProductResolver {
  constructor(
    @Inject("GET_PRODUCT_ITEMS")
    private readonly getProducts: IUseCase<Product[], void>
  ) {}
  @Query((returns) => [Product])
  async items(): Promise<Product[]> {

    return await this.getProducts.handle();
  }
}
