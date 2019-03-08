import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

// importando a nossa conexão ao banco de dados.
import db from './models/index';

// importando nosso schema
import schema from './graphql/schema';
import { extractJwtMiddleware } from './middlewares/extract-jwt.middleware';

class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
    }

    private middleware(): void {

        // Usando nosso 'express-graphql'
        this.express.use('/graphql',

            // middlare que valida o Token
            extractJwtMiddleware(),

            (req, res, next) => {
                // req['context'] = {}; // foi removido porque já é criado o contexto no 'extractJwtMiddleware'
                req['context'].db = db;
                next(); // usado para sair e chamar o próximo middleware
            },
        
            graphqlHTTP((req) => ({
                schema: schema,
                // Só habilitamos essa interface para 'development'
                graphiql: process.env.NODE_ENV === 'development',
                context: req['context']     // pega nosso objeto context e insere 
                                            // dentro da nossa propriedade GraphQL.
            }))
        );
    }
}

export default new App().express;