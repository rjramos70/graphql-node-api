"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const graphqlHTTP = require("express-graphql");
// importando a nossa conexão ao banco de dados.
const index_1 = require("./models/index");
// importando nosso schema
const schema_1 = require("./graphql/schema");
const extract_jwt_middleware_1 = require("./middlewares/extract-jwt.middleware");
class App {
    constructor() {
        this.express = express();
        this.middleware();
    }
    middleware() {
        // Usando nosso 'express-graphql'
        this.express.use('/graphql', 
        // middlare que valida o Token
        extract_jwt_middleware_1.extractJwtMiddleware(), (req, res, next) => {
            // req['context'] = {}; // foi removido porque já é criado o contexto no 'extractJwtMiddleware'
            req['context'].db = index_1.default;
            next(); // usado para sair e chamar o próximo middleware
        }, graphqlHTTP((req) => ({
            schema: schema_1.default,
            // Só habilitamos essa interface para 'development'
            graphiql: process.env.NODE_ENV === 'development',
            context: req['context'] // pega nosso objeto context e insere 
            // dentro da nossa propriedade GraphQL.
        })));
    }
}
exports.default = new App().express;
