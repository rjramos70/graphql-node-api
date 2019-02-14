import { postMutations } from './resources/post/post.schema';
import { userMutations } from './resources/user/user.schema';
import { tokenMutations } from './resources/token/token.schema';
import { commentMutations } from './resources/comment/comment.schema';

const Mutation = `
    type Mutation {
        ${postMutations}
        ${userMutations}
        ${tokenMutations}
        ${commentMutations}
    }
`;

export {
    Mutation
}
