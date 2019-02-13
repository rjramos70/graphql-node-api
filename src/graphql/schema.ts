// Cria um schema executavel
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

import { Query } from './query';
import { Mutation } from './mutation';

import { postTypes } from './resources/post/post.schema';
import { userTypes } from './resources/user/user.schema';
import { commentTypes } from './resources/comment/comment.schema';

import { commentResolvers } from './resources/comment/comment.resolvers';
import { postResolvers } from './resources/post/post.resolvers';
import { userResolvers } from './resources/user/user.resolvers';

// O merge do lodash faz todo esse processo e devolvendo um objeto unificado
// com todas as nossas Queries, Mutations e tambem todos os Resolvers não triviais
// que foram implementada em cada situação.
const resolvers = merge(
    commentResolvers,
    postResolvers,
    userResolvers
);


const SchemaDefinition = `
    type Schema {
        query: Query
        mutation: Mutation
    }
`;

// Faz o casamento entre os tipos e os resolvers
export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        postTypes,
        userTypes,
        commentTypes
    ],
    resolvers 
});