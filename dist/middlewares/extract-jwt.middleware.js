"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const index_1 = require("./../models/index");
const utils_1 = require("../utils/utils");
exports.extractJwtMiddleware = () => {
    return (req, res, next) => {
        // recebe nosso Token pelo cabeçalho 'authorization'
        let authorization = req.get('authorization');
        // verifica se variavel 'authorization' veio preenchido, se SIM, quebra a string por espaço e 
        // retorna somente a segunda parte, index 1, da string, não havendo, retornar 'undefined'.
        let token = authorization ? authorization.split(' ')[1] : undefined;
        // cria um contexto na requisição e insere um objeto 'context'.
        req['context'] = {};
        // agora dentro do 'context' vai ser criado um atributo de nome 'authorization'
        // que vai receber nosso Token completo.
        req['context']['authorization'] = authorization;
        // verifica se o token retornou na requisição.
        // return 'next' para chamar o proximo middleware e tambem vai para a 
        // execução neste ponto. Não executa o resto do código. Para aqui !!!
        if (!token) {
            return next();
        }
        jwt.verify(token, utils_1.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next();
            }
            // não havendo erro, buscar os dados com base no atributo 
            // 'sub' dentro do  payload (decoded)
            index_1.default.User.findById(decoded.sub, {
                // seleciona os atributos que queremos retornar
                attributes: ['id', 'email']
            }).then((user) => {
                // no 'then', depois que buscar os registros no banco de dados
                // se existir um registro de usuário válido
                if (user) {
                    // colocar as informações do usuário dentro do contexto
                    req['context']['user'] = {
                        id: user.get('id'),
                        email: user.get('email')
                    };
                }
                // independente de retornar ou não um usuário válido, chamr o 'next'
                return next();
            });
        });
    };
};
