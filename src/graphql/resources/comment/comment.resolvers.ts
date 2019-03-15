import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { Transaction } from "sequelize";
import { CommentInstance } from "../../../models/CommentModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";

export const commentResolvers = {

    // Resolvers não triviais
    Comment: {
        user: (comment, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.User
                .findById(comment.get('user'))
                .catch(handleError);
        },
        post: (comment, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.Post
                .findById(comment.get('post'))
                .catch(handleError);
        }
    },

    Query: {
        commentsByPost: (parent, {postId, first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            postId = parseInt(postId);  // Faz um paser do tipo 'postId' para Int;
            return db.Comment
                .findAll({
                    where: {post: postId},
                    limit: first,
                    offset: offset
                })
                .catch(handleError);
        }
    },
    Mutation: {
        createComment: compose(...authResolvers)((parent, {input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            // pega o usuário que é setado depois de passar nos validadores de usuário e token em 'authResolvers' e seta o 'ID' do usuário
            input.user = authUser.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .create(input, {transaction: t});   // Indica que estamos trabalhando com 
                                                        // transações e passa a Transaction
            }).catch(handleError);
        }),
        updateComment: compose(...authResolvers)((parent, {id, input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        throwError (!comment, `Comment with id ${id} not found!`);
                        // caso o usuário tente editar Post de outro usuário
                        throwError(comment.get('user') != authUser.id, `Unauthorized! You can only edit comment by yourself!`);
                        // pega o usuário que é setado depois de passar nos validadores de usuário e token em 'authResolvers' e seta o 'ID' do usuário
                        input.user = authUser.id;
                        return comment.update(input, {transaction: t});
                    });
            }).catch(handleError);
        }),
        deleteComment: compose(...authResolvers)((parent, {id}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        throwError (!comment, `Comment with id ${id} not found!`);
                        // caso o usuário tente editar Post de outro usuário
                        throwError(comment.get('user') != authUser.id, `Unauthorized! You can only delete comment by yourself!`);
                        return comment.destroy({transaction: t})
                            .then(comment => !!comment);
                    });
            }).catch(handleError);
        })

    }
// An expression of type 'void' cannot be tested for truthinessts(1345)
// (parameter) comment: void
}