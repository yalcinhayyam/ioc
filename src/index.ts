import "reflect-metadata";

import { buildSchemaSync } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { collection } from "./di";
import { ProductResolver } from "./features/catalogue/presentation/graphql";


const schema = buildSchemaSync({
  resolvers: [ProductResolver],
  container: {
    get(someClass, resolverData) {
      return collection.resolve(someClass);
    },
  },
});



async function main() {
  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

main();


// injector
//   .service<IUseCase<any[], void>>(GET_PRODUCT_ITEMS)
//   .handle()
//   .then(console.log);
// injector.useCase<any[], void>(GET_PRODUCT_ITEMS)().then(console.log);
