export { postLogOut, postSignIn, postSignUp } from "./auth.controller";
export {
    getMain,
    getSignIn,
    getSignUp,
    getUsersNotFollowed,
    postAddFriend,
    getUserProfile,
    postChangeUserAvatar,
} from "./user.controller";
export {
    postPost,
    getLastPublishedPost,
    getUserPosts,
    getAllFriendsPosts,
    postDislikePost,
    postLikePost,
    postUnreactPost,
} from "./post.controller";
export { getCommentsFromPost, postPostComment } from "./comment.controller";
