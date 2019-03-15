"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postTypes = `

    # Post definition type
    type Post {
        id: ID!
        title: String!
        photo: String!
        createdAt: String!
        updatedAt: String!
        author: User!
        comments(first: Int, offset: Int): [ Comment! ]!
    }

    # Input to create an Post
    input PostInput {
        title: String!
        content: String!
        photo: String!
    }

`;
exports.postTypes = postTypes;
const postQueries = `
    posts(first: Int, offset: Int): [ Post! ]!
    post(id: ID!): Post

`;
exports.postQueries = postQueries;
const postMutations = `
    createPost(input: PostInput!): Post
    updatePost(id: ID!, input: PostInput!): Post
    deletePost(id: ID!): Boolean

`;
exports.postMutations = postMutations;
