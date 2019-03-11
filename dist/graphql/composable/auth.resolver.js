"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verify_token_resolver_1 = require("./verify-token.resolver");
exports.authResolver = (resolver) => {
    return (parent, args, context, info) => {
        //  se dentro do conteto tive 'user' ou 'authorization'
        if (context.authUser || context.authorization) {
            return resolver(parent, args, context, info);
        }
        // caso não exista 'user' ou 'authoriation' setados no contexto, lança uma mensagem !!
        throw new Error('Unauthorized Token not provided!');
    };
};
exports.authResolvers = [exports.authResolver, verify_token_resolver_1.verifyTokenResolver];
