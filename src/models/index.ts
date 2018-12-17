// arquivo responsável por preparar a instância Sequelize, ler os models.
import * as fs from 'fs';   // pacote para leitura de arquivos no HD.
import * as path from 'path';
import * as Sequelize from 'sequelize';
import { DbConnection } from '../interfaces/DbConnectionInterface';

const basename: string = path.basename(module.filename);    // pega o nme do arquivo
const env: string =  process.env.NODE_ENV || 'development'  // pega o ambiente onde estamos trabalhando, se não houver assume 'development'.

// Agora vamos ler as configurações do nosso arquivo 'config.json'
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
// require : pega o arquivo pelo caminho e transforma em um objeto.
// __dirname : pega o caminho do nosso diretório pricipal.
// ./../ : volta um diretório para chegarmos ao diretório 'config'.
// [env] : pega somento o atributo que estamos querendo trabalhar dentro do objeto
let db = null;

// sempre iremos trabalhar com instância unica de banco de dados (Singleton)
if (!db) {
    db = {};

    // Desativa os operadores de 
    const operatorsAliases = false;
    config = Object.assign( { operatorsAliases }, config);

    // preparando a instância
    const sequelize: Sequelize.Sequelize = new Sequelize(
        config.database, 
        config.username, 
        config.password, 
        config
    );
    // Agora vamos ler os models que temos em nosso diretório
    fs
        .readdirSync(__dirname)
        .filter((file: string) => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach((file: string) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model['name']] = model;
        });

    // Agora vamos percorrer as chaves que temos em nosso objeto 'db' 
    // para ele chamar as associações de cada model.
    Object.keys(db).forEach((modelName: string) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });  
    // Vamos injetar no objeto 'db' a instância do Sequelize criada anterior.
    db['sequelize'] = sequelize;   
}
// variavel de conexão com banco de dados
export default <DbConnection>db;
