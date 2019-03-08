"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResolver = (resolver) => {
    return (parent, args, context, info) => {
        //  se dentro do conteto tive 'user' ou 'authorization'
        if (context.user || context.authorization) {
            return resolver(parent, args, context, info);
        }
        // caso não exista 'user' ou 'authoriation' setados no contexto, lança uma mensagem !!
        throw new Error('Unauthorized Token not provided!');
    };
};
