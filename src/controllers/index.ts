export { postLogOut, postSignIn, postSignUp } from "./auth.controller";
export { getMain as getProfile, getSignIn, getSignUp, getUsersNotFriends, postAddFriend } from "./user.controller";
export { postPost, getLastPublishedPost, getUserPosts, getAllFriendsPosts, postDislikePost, postLikePost, postUnreactPost } from "./post.controller";
