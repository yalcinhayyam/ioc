import Container from "typedi";
import { ProductService } from "./features/catalogue/infrastructure/services";
import { GetProducts } from "./features/catalogue/application/use-cases/get-products";
import {
  PRODUCT_SERVICE,
  CREATE_QUERY,
  GET_PRODUCTS_HANDLER,
  GET_PRODUCT_OPTIONS_HANDLER,
} from "./features/catalogue/constants";
import { Injector } from "./core/utilities/injector";
import { TypediInjectorCollection } from "./core/utilities/typedi-injector";
import { Prisma, PrismaClient } from "./prisma/generated/client";
import { createQuery } from "./core/utilities/graphql/field-selector";
import { GetProductOptions } from "./features/catalogue/application/use-cases/get-product-options";
import { CacheStorage } from "./core/utilities/cache-storage";

export const collection = new TypediInjectorCollection(Container);

const client = new PrismaClient();
const PRISMA_CLIENT = "PRISMA_CLIENT";
export const CACHE_STORAGE = "CACHE_STORAGE";

collection.register(CACHE_STORAGE, CacheStorage.create());
collection.register(CREATE_QUERY, createQuery(Injector.create(collection)));
collection.register(PRISMA_CLIENT, client);

collection.register(PRODUCT_SERVICE, new ProductService());
collection.register(
  GET_PRODUCTS_HANDLER,
  new GetProducts(collection.resolve<PrismaClient>(PRISMA_CLIENT))
);
collection.register(
  GET_PRODUCT_OPTIONS_HANDLER,
  new GetProductOptions(collection.resolve<PrismaClient>(PRISMA_CLIENT))
);

export const Inject = collection.Inject;
export const Injectable = collection.Injectable;
export const injector = Injector.create(collection);

// const prisma = new PrismaClient();

// const products: Prisma.TypeMap["model"]["Product"]["operations"]["create"]["args"]["data"][] =
//   [
//     {
//       name: "Test Product1",
//       description: "Test Product Description1",
//       isDraft: false,
//       isActive: true,
//       options: {
//         create: [
//           {
//             price: 100,
//             stock: 10,
//             code: "blue",
//           },
//           {
//             price: 100,
//             stock: 10,
//             code: "red",
//           },
//         ],
//       },
//     },
//     {
//       name: "Test Product2",
//       description: "Test Product Description2",
//       isDraft: false,
//       isActive: false,
//       options: {
//         create: [
//           {
//             price: 90,
//             stock: 5,
//             code: "sm",
//           },
//         ],
//       },
//     },
//   ];

// products.forEach((product) => {
//   prisma.product.create({ data: product }).then(res=> console.log(res));
// });

