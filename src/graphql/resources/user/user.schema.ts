const userTypes = `

    # User definition type
    type User {
        id: ID!
        name: String!
        email: String!
        photo: String
        createdAt: String!
        updatedAt: String!
        posts(first: Int, offset: Int): [ Post! ]!
    }

    # Input to create an User
    input UserCreateInput {
        name: String!
        email: String!
        password: String!
    }

    # Input to update User
    input UserUpdateInput {
        name: String!
        email: String!
        photo: String!
    }

    # Input to update the password
    input UserUpdatePasswordInput {
        password: String!
    }

`;

const userQueries = `
    users(first: Int, offset: Int): [ User! ]!
    user(id: ID!): User
`;

const userMutations = `
    createUser(input: UserCreateInput!): User
    updateUser(input: UserUpdateInput!): User
    updateUserPassword(input: UserUpdatePasswordInput!): Boolean
    deleteUser: Boolean
`;
export {
    userTypes,
    userQueries,
    userMutations
}
