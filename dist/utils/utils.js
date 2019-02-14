"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Recebe como parametro um valor e vai normalizar essa porta. 
exports.normalizePort = (val) => {
    let port = (typeof val === 'string') ? parseInt(val) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
};
// Espera uma parametro do tipo 'Server' do nosso pacote 'http'
exports.onError = (server) => {
    // retorna uma outra função que espera como parametro um 'Error'
    return (error) => {
        let port = server.address().port;
        if (error.syscall !== 'listen')
            throw error;
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
    };
};
// Espera uma parametro do tipo 'Server' do nosso pacote 'http'
exports.onListening = (server) => {
    // retorna uma outra função
    return () => {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening at ${bind}...`);
    };
};
// Manipulador de erro do Sequelize
exports.handleError = (erro) => {
    let erroMessage = `${erro.name}: ${erro.message}`;
    console.log(erroMessage);
    return Promise.reject(new Error(erroMessage));
};
// chave secreta para assinarmos nossos Tokens com variavel de ambiente
exports.JWT_SECRET = process.env.JWT_SECRET;
