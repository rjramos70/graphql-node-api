"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_schema_1 = require("./resources/post/post.schema");
const user_schema_1 = require("./resources/user/user.schema");
const token_schema_1 = require("./resources/token/token.schema");
const comment_schema_1 = require("./resources/comment/comment.schema");
const Mutation = `
    type Mutation {
        ${post_schema_1.postMutations}
        ${user_schema_1.userMutations}
        ${token_schema_1.tokenMutations}
        ${comment_schema_1.commentMutations}
    }
`;
exports.Mutation = Mutation;
