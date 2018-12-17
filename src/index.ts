import * as http from 'http';

import app from './app';
// import do nosso 'db'
import db from './models';
import { normalizePort, onError, onListening } from './utils/utils';

const server = http.createServer(app);
const port = normalizePort(process.env.port || 7000);

// Faz a sincronização do Sequelize com o MySQL
db.sequelize.sync()
    .then(() => {   // depois que fizer a sincronização
        // Subir o servidor
        server.listen(port);
        server.on('error', onError(server));
        server.on('listening', onListening(server));
    });


