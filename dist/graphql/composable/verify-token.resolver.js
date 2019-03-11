"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const utils_1 = require("../../utils/utils");
exports.verifyTokenResolver = (resolver) => {
    return (parent, args, context, info) => {
        // context.authorization --> retorna o Token inteiro (Bearer dasadsdadsada.addadadda.dadadadadada)
        // mas para pegar somente a string do Token precisamos fazer um split e pegr a segunda posição do 
        // array, posição 1.
        const token = context.authorization ? context.authorization.split(' ')[1] : undefined;
        // agora verificamos o nosso Token
        return jwt.verify(token, utils_1.JWT_SECRET, (err, decoded) => {
            // se for um Token válido
            if (!err) {
                return resolver(parent, args, context, info);
            }
            // senão lança uma mensagem de erro.
            throw new Error(`${err.name}: ${err.message}`);
        });
    };
};
