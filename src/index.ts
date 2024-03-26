import "reflect-metadata";

import { buildSchemaSync } from "type-graphql";
import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { CACHE_STORAGE, collection, injector } from "./di";
import { ProductResolver } from "./features/catalogue/presentation/graphql";
import { Cursor, CursorScalar } from "./core/utilities/graphql/scalars";
import { Context } from "./core/types";
import { CacheStorage } from "./core/utilities/cache-storage";
import { Prisma, PrismaClient, Product } from "./prisma/generated/client";

const schema = buildSchemaSync({
  scalarsMap: [{ type: Cursor, scalar: CursorScalar }],
  resolvers: [ProductResolver],

  container: {
    get(someClass, resolverData) {
      return collection.resolve(someClass);
    },
  },
});

const BASIC_LOGGING: ApolloServerPlugin<Context> = {
  async requestDidStart({ request }) {
    console.log("request started");
    console.log(request.query);
    console.log(request.variables);
    return {
      async willSendResponse(requestContext) {
        console.log("request completed");

        // requestContext.contextValue.injector.service<CacheStorage>(CACHE_STORAGE).del()
      },
    };
  },
};
async function main() {
  const server = new ApolloServer<Context>({
    schema,
    // plugins: [BASIC_LOGGING],
  });

  const { url } = await startStandaloneServer<Context>(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => ({ req, res, injector }),
  });
  console.log`Apollo Server started at ${url} 🚀`
}

main();

// injector
//   .service<IUseCase<any[], void>>(GET_PRODUCT_ITEMS)
//   .handle()
//   .then(console.log);
// injector.useCase<any[], void>(GET_PRODUCT_ITEMS)().then(console.log);

// import {CamelCase} from 'ts-essentials'

// const foo: CamelCase<'Ali_veli'> = 'aliVeli'
/*
const prisma = new PrismaClient();
type Model = Prisma.TypeMap["model"];
type $ModelName = keyof Model;
type $OperationName<ModelName extends $ModelName | never = never> =
  ModelName extends never
    ? keyof Model[$ModelName]["operations"]
    : keyof Model[ModelName]["operations"];
type Operation<
  ModelName extends $ModelName,
  OperationName extends "findMany" | "findFirst" //$OperationName<ModelName>
> = Model[ModelName]["operations"][OperationName];

class Queryable<
  T extends Prisma.TypeMap["meta"]["modelProps"],
  ModelName extends $ModelName,
  OperationName extends "findMany" | "findFirst"
> {
  constructor(
    private readonly model: T,
    private readonly operation: OperationName
  ) {}

  query: Operation<ModelName, OperationName>["args"] = {};

  where(args: Operation<ModelName, OperationName>["args"]["where"]) {
    this._apply(args, "where");
    return this;
  }

  include(args: Operation<ModelName, OperationName>["args"]["include"]) {
    this._apply(args, "include");
    return this;
  }

  select(args: Operation<ModelName, OperationName>["args"]["select"]) {
    this._apply(args, "select");
    return this;
  }


  private _apply<Key extends keyof Operation<ModelName, OperationName>["args"]>(
    value: Operation<ModelName, OperationName>["args"][Key],
    key: Key
  ) {
    this.query = {
      ...this.query,
      [key]: {
        ...this.query[key],
        ...value,
      },
    } as const;
  }
}

const queryable = new Queryable<"product", "Product", "findMany">(
  "product",
  "findMany"
)
  .where({ id: "123" })
  .where({ name: "..." })
  .where({ options: { every: { code: "wqdwq" } } });

class DbContext {
  constructor(private readonly _prisma: PrismaClient) {}

  product(
    modelName: "Product",
    operation: "findMany"
  ): Queryable<"product", "Product", "findMany"> {
    return new Queryable<"product", "Product", "findMany">(
      "product",
      "findMany"
    );
  }
}

console.log(JSON.stringify(queryable.query));
*/