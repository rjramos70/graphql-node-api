import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

// importando nosso schema
import schema from './graphql/schema';

class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
    }

    private middleware(): void {
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
            schema: schema,
            // Só habilitamos essa interface para 'development'
            graphiql: process.env.NODE_ENV === 'development'
        }));
    }
}

export default new App().express;