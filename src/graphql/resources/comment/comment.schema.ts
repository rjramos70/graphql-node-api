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

const commentQueries = `
    # Query to list all comments by post id
    commentsByPost(postId: ID!, first: Int, offset: Int): [ Comment! ]!
`;

const commentMutations = `
    createComment(input: CommentInput!): Comment
    updateComment(id: ID!, input: CommentInput!): Comment
    deleteComment(id: ID!): Boolean
`;

export {
    commentTypes,
    commentQueries,
    commentMutations
}