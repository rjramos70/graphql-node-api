import * as jwt from 'jsonwebtoken';
import db from './../models/index'
import { RequestHandler, Request, Response, NextFunction } from "express";
import { JWT_SECRET } from '../utils/utils';
import { UserInstance } from '../models/UserModel';

export const extractJwtMiddleware = (): RequestHandler => {

    return (req: Request, res: Response, next: NextFunction): void => {

        // recebe nosso Token pelo cabeçalho 'authorization'
        let authorization: string = req.get('authorization');

        // verifica se variavel 'authorization' veio preenchido, se SIM, quebra a string por espaço e 
        // retorna somente a segunda parte, index 1, da string, não havendo, retornar 'undefined'.
        let token: string = authorization ? authorization.split(' ')[1] : undefined;

        // cria um contexto na requisição e insere um objeto 'context'.
        req['context'] = {};

        // agora dentro do 'context' vai ser criado um atributo de nome 'authorization'
        // que vai receber nosso Token completo.
        req['context']['authorization'] = authorization;

        // verifica se o token retornou na requisição.
        // return 'next' para chamar o proximo middleware e tambem vai para a 
        // execução neste ponto. Não executa o resto do código. Para aqui !!!
        if(!token){ return next(); }

        jwt.verify(token, JWT_SECRET, (err, decoded: any) => {

            if(err){ return next(); }
            // não havendo erro, buscar os dados com base no atributo 
            // 'sub' dentro do  payload (decoded)
            db.User.findById(decoded.sub, {
                // seleciona os atributos que queremos retornar
                attributes: [ 'id', 'email' ]
            }).then((user: UserInstance) => {

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