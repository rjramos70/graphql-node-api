"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils/utils");
const composable_resolver_1 = require("../../composable/composable.resolver");
const auth_resolver_1 = require("../../composable/auth.resolver");
exports.commentResolvers = {
    // Resolvers não triviais
    Comment: {
        user: (comment, args, { db }, info) => {
            return db.User
                .findById(comment.get('user'))
                .catch(utils_1.handleError);
        },
        post: (comment, args, { db }, info) => {
            return db.Post
                .findById(comment.get('post'))
                .catch(utils_1.handleError);
        }
    },
    Query: {
        commentsByPost: (parent, { postId, first = 10, offset = 0 }, { db }, info) => {
            postId = parseInt(postId); // Faz um paser do tipo 'postId' para Int;
            return db.Comment
                .findAll({
                where: { post: postId },
                limit: first,
                offset: offset
            })
                .catch(utils_1.handleError);
        }
    },
    Mutation: {
        createComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { input }, { db, authUser }, info) => {
            // pega o usuário que é setado depois de passar nos validadores de usuário e token em 'authResolvers' e seta o 'ID' do usuário
            input.user = authUser.id;
            return db.sequelize.transaction((t) => {
                return db.Comment
                    .create(input, { transaction: t }); // Indica que estamos trabalhando com 
                // transações e passa a Transaction
            }).catch(utils_1.handleError);
        }),
        updateComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id, input }, { db, authUser }, info) => {
            id = parseInt(id);
            return db.sequelize.transaction((t) => {
                return db.Comment
                    .findById(id)
                    .then((comment) => {
                    utils_1.throwError(!comment, `Comment with id ${id} not found!`);
                    // caso o usuário tente editar Post de outro usuário
                    utils_1.throwError(comment.get('user') != authUser.id, `Unauthorized! You can only edit comment by yourself!`);
                    // pega o usuário que é setado depois de passar nos validadores de usuário e token em 'authResolvers' e seta o 'ID' do usuário
                    input.user = authUser.id;
                    return comment.update(input, { transaction: t });
                });
            }).catch(utils_1.handleError);
        }),
        deleteComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id }, { db, authUser }, info) => {
            id = parseInt(id);
            return db.sequelize.transaction((t) => {
                return db.Comment
                    .findById(id)
                    .then((comment) => {
                    utils_1.throwError(!comment, `Comment with id ${id} not found!`);
                    // caso o usuário tente editar Post de outro usuário
                    utils_1.throwError(comment.get('user') != authUser.id, `Unauthorized! You can only delete comment by yourself!`);
                    return comment.destroy({ transaction: t })
                        .then(comment => !!comment);
                });
            }).catch(utils_1.handleError);
        })
    }
    // An expression of type 'void' cannot be tested for truthinessts(1345)
    // (parameter) comment: void
};
