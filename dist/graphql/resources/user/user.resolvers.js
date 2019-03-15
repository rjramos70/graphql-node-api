"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils/utils");
const composable_resolver_1 = require("../../composable/composable.resolver");
const auth_resolver_1 = require("../../composable/auth.resolver");
// import { verifyTokenResolver } from '../../composable/verify-token.resolver';
exports.userResolvers = {
    User: {
        // Esse campo 'post'vai ser implementado um 'resolver' não trivial.
        posts: (user, { first = 10, offset = 0 }, { db }, info) => {
            return db.Post
                .findAll({
                where: { author: user.get('id') },
                limit: first,
                offset: offset
            })
                .catch(utils_1.handleError);
        }
    },
    Query: {
        // o terceiro parametro 'context' foi desestruturado para {db}:{db: DbConnection} 
        // o segundo parametro 'args' foi desestruturdo para {first = 10, offset = 0} que são valores 
        // default que serão assumidos se não forem passados valores.
        users: (parent, { first = 10, offset = 0 }, { db }, info) => {
            // Abaixo a camada de Banco de Dados
            // Aqui devemos fazer o SQL no banco para trazer os usuários.
            return db.User
                .findAll({
                limit: first,
                offset: offset
            })
                .catch(utils_1.handleError);
        },
        // user: (parent, args, context, info) => {
        user: (parent, { id }, { db }, info) => {
            id = parseInt(id); // Faz um paser do tipo 'ID' para Int;
            return db.User
                .findById(id)
                .then((user) => {
                if (!user) {
                    // Se for passado um 'id' de um usuário que não existe, lança um Error;
                    utils_1.throwError(!user, `User with id ${id} not found!`);
                }
                return user;
            })
                .catch(utils_1.handleError);
        },
        currentUser: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, args, { db, authUser }, info) => {
            return db.User
                .findById(authUser.id) // pega o ID pelo 'authUser'
                .then((user) => {
                utils_1.throwError(!user, `User with id ${authUser.id} not found!`);
                return user;
            }).catch(utils_1.handleError);
        })
    },
    Mutation: {
        createUser: (parent, { input }, { db }, info) => {
            return db.sequelize.transaction((t) => {
                return db.User
                    .create(input, { transaction: t });
            })
                .catch(utils_1.handleError);
        },
        updateUser: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { input }, { db, authUser }, info) => {
            // id = parseInt(id);  // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t) => {
                return db.User
                    .findById(authUser.id) // pega o ID pelo 'authUser'
                    .then((user) => {
                    utils_1.throwError(!user, `User with id ${authUser.id} not found!`);
                    return user.update(input, { transaction: t });
                });
            })
                .catch(utils_1.handleError);
        }),
        updateUserPassword: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { input }, { db, authUser }, info) => {
            // id = parseInt(id);  // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t) => {
                return db.User
                    .findById(authUser.id) // primeiro busca pelo 'id'
                    .then((user) => {
                    utils_1.throwError(!user, `User with id ${authUser.id} not found!`);
                    return user
                        .update(input, { transaction: t })
                        .then((user) => !!user);
                });
            })
                .catch(utils_1.handleError);
        }),
        deleteUser: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, args, { db, authUser }, info) => {
            // id = parseInt(id);  // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t) => {
                return db.User
                    .findById(authUser.id)
                    .then((user) => {
                    utils_1.throwError(!user, `User with id ${authUser.id} not found!`);
                    return user
                        .destroy({ transaction: t })
                        .then(user => !!user);
                });
            })
                .catch(utils_1.handleError);
        })
    }
};
