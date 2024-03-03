import Container from "typedi";
import { ProductPrismaRepository, ProductRepository } from "./features/product/infrastructure/repositories";
import { ProductService } from "./features/product/infrastructure/services";
import { GetProductItems } from "./features/product/application/use-cases/get-products";
import { GET_PRODUCT_ITEMS, PRODUCT_REPOSITORY, PRODUCT_SERVICE } from "./features/product/constants";
import { Injector } from "./core/utilities/injector";
import { TypediInjectorCollection } from "./core/utilities/typedi-injector";
import { IProductRepository } from "./features/product/application/repositories";
import { PrismaClient } from "./prisma/generated/client";

export const collection = new TypediInjectorCollection(Container);


collection.register(PRODUCT_REPOSITORY, new ProductPrismaRepository(new PrismaClient()));
collection.register(
  PRODUCT_SERVICE,
  new ProductService(collection.resolve<IProductRepository>(PRODUCT_REPOSITORY))
);
collection.register(
  GET_PRODUCT_ITEMS,
  new GetProductItems(collection.resolve<IProductRepository>(PRODUCT_REPOSITORY))
);

export const Inject = collection.Inject;
export const Injectable = collection.Injectable;
export const injector = Injector.create(collection);
