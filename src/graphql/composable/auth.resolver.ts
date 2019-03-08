import { GraphQLFieldResolver } from 'graphql';

import { ComposableResolver } from './composable.resolver';
import { ResolverContext } from '../../interfaces/ResolverContextInterface';

export const authResolver: ComposableResolver<any, ResolverContext> = 
    (resolver: GraphQLFieldResolver<any, ResolverContext>): GraphQLFieldResolver<any, ResolverContext> => {
        return (parent, args, context: ResolverContext, info) => {
            //  se dentro do conteto tive 'user' ou 'authorization'
            if (context.user || context.authorization) {
                return resolver(parent, args, context, info);
            }

            // caso não exista 'user' ou 'authoriation' setados no contexto, lança uma mensagem !!
            throw new Error('Unauthorized Token not provided!')
        };
    };