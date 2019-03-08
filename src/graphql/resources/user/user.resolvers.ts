import { GraphQLResolveInfo } from 'graphql';
import { DbConnection } from '../../../interfaces/DbConnectionInterface';
import { UserInstance } from '../../../models/UserModel';
import { Transaction } from 'sequelize';
import { handleError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';
import { authResolver } from '../../composable/auth.resolver';
import { verifyTokenResolver } from '../../composable/verify-token.resolver';

export const userResolvers = {

    User: {
        // Esse campo 'post'vai ser implementado um 'resolver' não trivial.
        posts: (user, {first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.Post
                .findAll({
                    where: { author: user.get('id')},
                    limit: first,
                    offset: offset
                })
                .catch(handleError);
        }
    },

    Query: {
        // o terceiro parametro 'context' foi desestruturado para {db}:{db: DbConnection} 
        // o segundo parametro 'args' foi desestruturdo para {first = 10, offset = 0} que são valores 
        // default que serão assumidos se não forem passados valores.
        users: compose(authResolver, verifyTokenResolver)((parent, {first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            // Abaixo a camada de Banco de Dados
            // Aqui devemos fazer o SQL no banco para trazer os usuários.
            return db.User
                    .findAll({
                        limit: first,
                        offset: offset
                    })
                    .catch(handleError);
        }),
        // user: (parent, args, context, info) => {
        user: (parent, {id}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);  // Faz um paser do tipo 'ID' para Int;
            return db.User
                .findById(id)
                .then((user: UserInstance) => {
                    if (!user) {
                        // Se for passado um 'id' de um usuário que não existe, lança um Error;
                        throw new Error(`User with is ${id} not found!`);
                    }
                    return user;
                })
                .catch(handleError);
        }

    },
    Mutation: {
        createUser: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction(( t: Transaction ) => {
                return db.User
                        .create(input, { transaction: t });
            })
            .catch(handleError);
        },
        updateUser: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);  // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)   // primeiro busca pelo 'id'
                    .then((user: UserInstance) => {
                        if (!user) throw new Error(`User with id ${id} not found!`); 
                        return user.update(input, {transaction: t});
                    });
            })
            .catch(handleError);
        },
        updateUserPassword: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);  // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)   // primeiro busca pelo 'id'
                    .then((user: UserInstance) => {
                        if (!user) throw new Error(`User with id ${id} not found!`); 
                        return user
                                .update(input, {transaction: t})
                                .then((user: UserInstance) => !!user);
                    });
            })
            .catch(handleError);
        },
        deleteUser: (parent, {id}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);  // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                        .findById(id)
                        .then((user: UserInstance) => {
                            if (!user) throw new Error(`User with id ${id} not found!`); 
                            return user
                                    .destroy({transaction: t})
                                    .then(user => !!user);
                        });
            })
            .catch(handleError);
        }
    }
};