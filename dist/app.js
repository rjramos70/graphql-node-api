"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const graphqlHTTP = require("express-graphql");
// importando nosso schema
const schema_1 = require("./graphql/schema");
class App {
    constructor() {
        this.express = express();
        this.middleware();
    }
    middleware() {
        // os parametros podem ser tipados ou não, nesse exemplo estamos tipando
        // Como estamos usando o 'use' esta requisição vai atender a GET, POST, PUT, DELETE, etc...
        /*
        this.express.use('/hello', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.send({
                hello: 'Hello World!'
            });
        });
        */
        // Usando nosso 'express-graphql'
        this.express.use('/graphql', graphqlHTTP({
            schema: schema_1.default,
            // Só habilitamos essa interface para 'development'
            graphiql: process.env.NODE_ENV === 'development'
        }));
    }
}
exports.default = new App().express;
