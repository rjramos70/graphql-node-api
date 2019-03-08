"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils/utils");
const composable_resolver_1 = require("../../composable/composable.resolver");
const auth_resolver_1 = require("../../composable/auth.resolver");
const verify_token_resolver_1 = require("../../composable/verify-token.resolver");
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
        users: composable_resolver_1.compose(auth_resolver_1.authResolver, verify_token_resolver_1.verifyTokenResolver)((parent, { first = 10, offset = 0 }, { db }, info) => {
            // Abaixo a camada de Banco de Dados
            // Aqui devemos fazer o SQL no banco para trazer os usuários.
            return db.User
                .findAll({
                limit: first,
                offset: offset
            })
                .catch(utils_1.handleError);
        }),
        // user: (parent, args, context, info) => {
        user: (parent, { id }, { db }, info) => {
            id = parseInt(id); // Faz um paser do tipo 'ID' para Int;
            return db.User
                .findById(id)
                .then((user) => {
                if (!user) {
                    // Se for passado um 'id' de um usuário que não existe, lança um Error;
                    throw new Error(`User with is ${id} not found!`);
                }
                return user;
            })
                .catch(utils_1.handleError);
        }
    },
    Mutation: {
        createUser: (parent, { input }, { db }, info) => {
            return db.sequelize.transaction((t) => {
                return db.User
                    .create(input, { transaction: t });
            })
                .catch(utils_1.handleError);
        },
        updateUser: (parent, { id, input }, { db }, info) => {
            id = parseInt(id); // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t) => {
                return db.User
                    .findById(id) // primeiro busca pelo 'id'
                    .then((user) => {
                    if (!user)
                        throw new Error(`User with id ${id} not found!`);
                    return user.update(input, { transaction: t });
                });
            })
                .catch(utils_1.handleError);
        },
        updateUserPassword: (parent, { id, input }, { db }, info) => {
            id = parseInt(id); // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t) => {
                return db.User
                    .findById(id) // primeiro busca pelo 'id'
                    .then((user) => {
                    if (!user)
                        throw new Error(`User with id ${id} not found!`);
                    return user
                        .update(input, { transaction: t })
                        .then((user) => !!user);
                });
            })
                .catch(utils_1.handleError);
        },
        deleteUser: (parent, { id }, { db }, info) => {
            id = parseInt(id); // Faz um paser do tipo 'ID' para Int;
            return db.sequelize.transaction((t) => {
                return db.User
                    .findById(id)
                    .then((user) => {
                    if (!user)
                        throw new Error(`User with id ${id} not found!`);
                    return user
                        .destroy({ transaction: t })
                        .then(user => !!user);
                });
            })
                .catch(utils_1.handleError);
        }
    }
};
