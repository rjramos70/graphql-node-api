import * as jwt from 'jsonwebtoken';
import { GraphQLFieldResolver } from "graphql";

import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import { JWT_SECRET } from '../../utils/utils';

export const verifyTokenResolver: ComposableResolver<any, ResolverContext> =
    (resolver: GraphQLFieldResolver<any, ResolverContext>): GraphQLFieldResolver<any, ResolverContext> => {

        return (parent, args, context: ResolverContext, info) => {

            // context.authorization --> retorna o Token inteiro (Bearer dasadsdadsada.addadadda.dadadadadada)
            // mas para pegar somente a string do Token precisamos fazer um split e pegr a segunda posição do 
            // array, posição 1.
            const token: string = context.authorization ? context.authorization.split(' ')[1] : undefined;

            // agora verificamos o nosso Token
            jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
                // se for um Token válido
                if (!err) {
                    return resolver(parent, args, context, info);
                }
                // senão lança uma mensagem de erro.
                throw new Error(`${err.name}: ${err.message}`);

            });

        };

    };