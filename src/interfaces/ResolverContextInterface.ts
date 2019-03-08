import { AuthUser } from './AuthUserInterface';
import { DbConnection } from './DbConnectionInterface';

export interface ResolverContext {

    // todos os atributos vão ser opcionais
    db?: DbConnection;      // nossa conexão com o banco de dados.
    authorization?: string; // representando nosso Taken que chega na requisição.
    user?: AuthUser;        // nosso usuário setado no contexto.

}