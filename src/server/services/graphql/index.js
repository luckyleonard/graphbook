import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import Resolvers from './resolvers';
import Schema from './schema';

export default (utils) => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils),
  }); //resolvers接从server index.js传过来的db实例

  const server = new ApolloServer({
    schema: executableSchema,
    context: ({ req }) => req,
  });

  return server;
};
