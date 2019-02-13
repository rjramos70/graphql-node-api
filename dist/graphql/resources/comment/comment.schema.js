"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commentTypes = `
    # Comment definition types
    type Comment {
        id: ID!
        comment: String!
        createdAt: String!
        updatedAt: String!
        user: User!
        post: Post!
    }

    # Input to create a Comment
    input CommentInput {
        comment: String!
        post: Int!
        user: Int!
    }
`;
exports.commentTypes = commentTypes;
const commentQueries = `
    # Query to list all comments by post id
    commentsByPost(postId: ID!, first: Int, offset: Int): [ Comment! ]!
`;
exports.commentQueries = commentQueries;
const commentMutations = `
    createComment(input: CommentInput!): Comment
    updateComment(id: ID!, input: CommentInput!): Comment
    deleteComment(id: ID!): Boolean
`;
exports.commentMutations = commentMutations;
