import { Server } from 'http';

// Recebe como parametro um valor e vai normalizar essa porta. 
export const normalizePort = (val: number | string): number | string | boolean => {
    let port: number = (typeof val === 'string') ? parseInt(val) : val;
    if(isNaN(port)) return val;
    else if(port >= 0) return port;
    else return false;
}

// Espera uma parametro do tipo 'Server' do nosso pacote 'http'
export const onError = (server: Server) => {
    // retorna uma outra função que espera como parametro um 'Error'
    return (error: NodeJS.ErrnoException): void => {
        let port: number | string = server.address().port;
        if(error.syscall !== 'listen') throw error;

        let bind = (typeof port === 'string') ? `pipe ${port}` : `port ${port}`;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}

// Espera uma parametro do tipo 'Server' do nosso pacote 'http'
export const onListening = (server: Server) => {
    // retorna uma outra função
    return (): void => {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening at ${bind}...`);
        
    }
}