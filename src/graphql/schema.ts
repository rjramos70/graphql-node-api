// Cria um schema executavel
import { makeExecutableSchema } from 'graphql-tools';

// Mock dos dados que vão retornar na função 'allUsers'
const users: any[] = [
    {
        id: 1,
        name: 'Jon',
        email: 'jon@email.com'
    },
    {
        id: 2,
        name: 'Dany',
        email: 'dany@email.com'
    },
    {
        id: 3,
        name: 'Aaron',
        email: 'aaron@email.com'
    },
    {
        id: 4,
        name: 'Zion',
        email: 'zion@email.com'
    },
    {
        id: 5,
        name: 'Kylla',
        email: 'kylla@email.com'
    },
    {
        id: 6,
        name: 'Gaspar',
        email: 'gaspar@email.com'
    },
    {
        id: 7,
        name: 'Charle',
        email: 'charle@email.com'
    },
    {
        id: 8,
        name: 'Oscar',
        email: 'oscar@email.com'
    }
];
// Definição do tipos (User, Query. etc..)
const typeDefs = `
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        allUsers: [User!]!
        filterUsers(start: Int, qtd: Int): [User!]!
        user(id: Int): User!
    }

    type Mutation {
        createUser(name: String!, email: String!): User
    }
`;

// Resolvers que resolvem as chamadas
const resolvers = {
    Query: {
        allUsers: () => users,
        filterUsers: (start, args) => {
            // console.log('%j', qtd);
            console.log('%j', start);
            return users.slice(args.start, args.qtd);
        },
        user: (any, id) => {
            // console.log('%j', id);
            
            // Lista todos os itens do Array
            // users.map(function(e){ console.log(e.id + ' - ' + e.name + ' - ' + e.email); });
            
            return users.find( u => u.id === id.id );

            // Verifica se usuário com ID passado como parametro existe no Array.
            // return users.some(function(elem, i){ return elem.id === id.id; });
        }
    },
    Mutation: {
        createUser: (parent, args, context, info) => {
            const newUser = Object.assign({id: users.length + 1}, args);
            users.push(newUser);
            return newUser;
        }
    }
};
// Faz o casamento entre os tipos e os resolvers
export default makeExecutableSchema({typeDefs, resolvers});