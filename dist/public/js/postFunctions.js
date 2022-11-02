"use strict";
const postButtonsImages = [
    "<img src='/img/like.png' class='react-post-img'></img>",
    "<img src='/img/dislike.png' class='react-post-img'></img>",
    "<img src='/img/dislikeLight.png' class='react-post-img'></img>",
];
const commentButtonsImages = [
    "<img src='/img/like.png' class='react-comment-img'></img>",
    "<img src='/img/dislike.png' class='react-comment-img'></img>",
    "<img src='/img/dislikeLight.png' class='react-comment-img'></img>",
];
const getOlderPostsBtn = document.getElementById("getOlderPosts");
const postFooter = document.getElementById("postFooter");
let oldestPostTimestamp = Date.now();
const generateButtonsFromStatus = (status, author, id, comment) => {
    const type = comment ? "Comment" : "Post";
    let likeButtonClass = `react-${type}-button like`;
    let likeButtonOnclick = `like${type}('${author}-${id}')`;
    let dislikeButtonClass = `react-${type}-button dislike`;
    let dislikeButtonOnclick = `dislike${type}('${author}-${id}')`;
    let dislikeImage = comment ? commentButtonsImages[1] : postButtonsImages[1];
    switch (status) {
        case 1:
            likeButtonClass = `liked-${type}-button`;
            likeButtonOnclick = `unreact${type}('${author}-${id}','like')`;
            break;
        case 2:
            dislikeButtonClass = `disliked-${type}-button`;
            dislikeButtonOnclick = `unreact${type}('${author}-${id}','dislike')`;
            dislikeImage = comment ? commentButtonsImages[2] : postButtonsImages[2];
            break;
    }
    return {
        like: { class: likeButtonClass, onclick: likeButtonOnclick },
        dislike: { class: dislikeButtonClass, onclick: dislikeButtonOnclick, image: dislikeImage },
    };
};
const formComment = (data) => {
    const comment = data.comment;
    const buttons = generateButtonsFromStatus(data.status, comment.author, comment._id, true);
    const likes = comment.likes[0] == "0" ? "0" : comment.likes.length.toString();
    const dislikes = comment.dislikes[0] == "0" ? "0" : comment.dislikes.length.toString();
    return `<div class="comment">
    <a href="/profiles/${comment.author}">
        <div class="post-profile-info">
            <img src="${data.authorAvatar}" class="profile-picture" style="filter: hue-rotate(${pickDefaultAvatarHue(comment.username)});"></img>
    <h5 class="middle-align">${comment.username}</h4>
        </div>
    </a> 
    <pre class="comment-content">${comment.content}</pre>
    <div>
      <button class="${buttons.like.class}" id="${comment.author}-${comment._id}-like" onclick="${buttons.like.onclick}" >${commentButtonsImages[0]}${likes}</button>
      <button class="${buttons.dislike.class}" id="${comment.author}-${comment._id}-dislike" onclick="${buttons.dislike.onclick}" >${buttons.dislike.image}${dislikes}</button>
    <small class="post-date">${comment.date}</small>
    </div>
  </div>`;
};
const formPost = (data) => {
    const post = data.post.content;
    const comments = data.post.comments;
    const likes = post.likes[0] == "0" ? "0" : post.likes.length.toString();
    const dislikes = post.dislikes[0] == "0" ? "0" : post.dislikes.length.toString();
    const buttons = generateButtonsFromStatus(data.status, post.author, post._id);
    let formattedComments = "";
    comments.forEach((comment) => (formattedComments += formComment(comment)));
    return `<div>
    <a href="/profiles/${post.author}">
        <div class="post-profile-info">
            <img src="${data.authorAvatar}" class="profile-picture" style="filter: hue-rotate(${pickDefaultAvatarHue(post.username)});"></img>
    <h4 class="middle-align">${post.username}</h4>
        </div>
    </a> 
    <pre>${post.content}</pre>
    <div>
      <button class="${buttons.like.class}" id="${post.author}-${post._id}-like" onclick="${buttons.like.onclick}" >${postButtonsImages[0]}${likes}</button>
      <button class="${buttons.dislike.class}" id="${post.author}-${post._id}-dislike" onclick="${buttons.dislike.onclick}" >${buttons.dislike.image}${dislikes}</button>
    <small class="post-date">${post.date}</small>
    </div>
    <di vclass="comments-container" >
        <div id="${post.author}-${post.timestamp}-comments" >${formattedComments}</div>
        <div class="comment-box" id="${post.author}-${post.timestamp}-commentbox">
            <input type="hidden" value="${post.author}-${post.timestamp}" />
            <textarea rows="3" cols="40" name="content" class="input-comment" placeholder="Write a comment..."></textarea>
            <input type="submit" id='${post.author}-${post.timestamp}-comment' class="submitButton" onclick="triggerPostComment('${post.author}-${post.timestamp}')" value="Post" />
        </div>
    </div>
  </div>`;
};
const triggerPostComment = (postId) => {
    const commentBtn = document.getElementById(postId + "-comment");
    if (!commentBtn)
        return;
    const textarea = commentBtn.previousElementSibling;
    if (!textarea || textarea.value == "")
        return;
    postComment(userInfo.email, textarea.value, postId);
    textarea.value = "";
};
const postComment = (author, content, postId) => {
    const token = getStringFromCookies("auth-token");
    fetch(`${apiCommentsUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "auth-token": token,
        },
        body: JSON.stringify({
            idFromPost: postId,
            content: content,
            author: author,
            timestamp: Date.now(),
            date: getDate(),
        }),
        credentials: "same-origin",
    })
        .then((res) => res.json())
        .then((res) => {
        const commentContainer = document.getElementById(`${res.comment.idFromPost}-comments`);
        const comment = formComment(res);
        if (commentContainer)
            commentContainer.innerHTML += comment;
    });
};
const addListenersToCommentAreas = () => {
    const inputCommentAreas = document.getElementsByClassName("input-comment");
    for (let i = 0; i < inputCommentAreas.length; i++) {
        const area = inputCommentAreas.item(i);
        if (!area)
            continue;
        area.addEventListener("keypress", (ev) => {
            if (ev.key == "Enter" && !ev.shiftKey) {
                ev.preventDefault();
                const postIdHidden = area.previousElementSibling;
                if (!postIdHidden)
                    return "Bad request";
                triggerPostComment(postIdHidden.value);
            }
        });
    }
};
const getAllFriendsPosts = (user) => {
    const token = getStringFromCookies("auth-token");
    fetch(`${apiPostUrl}/friendsposts?user=${user}&timestamp=${oldestPostTimestamp}`, {
        method: "GET",
        headers: {
            "auth-token": token,
        },
    })
        .then((res) => {
        return res.json();
    })
        .then((res) => {
        if (!res)
            return postFooter.setAttribute("style", "display: block");
        for (let p = 0; p < res.length; p++) {
            const post = document.createElement("div");
            post.classList.add("post");
            post.setAttribute("id", `${res[p].post.content.author}-${res[p].post.content.timestamp}`);
            post.innerHTML = formPost(res[p]);
            mainFeed.appendChild(post);
        }
        oldestPostTimestamp = res[res.length - 1].post.content.timestamp;
        addListenersToCommentAreas();
    });
};
const likePost = (postInfo) => {
    const likeButton = document.getElementById(`${postInfo}-like`);
    const dislikeButton = likeButton.nextElementSibling;
    const postId = postInfo.split("-")[1];
    const likes = likeButton.innerText;
    const dislikes = dislikeButton.innerText;
    const token = getStringFromCookies("auth-token");
    fetch(`${apiPostUrl}/likepost`, {
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "auth-token": token,
        },
        body: JSON.stringify({
            postId: postId,
            liker: userInfo.email,
            likes: likes,
            dislikes: dislikes,
        }),
        credentials: "same-origin",
    })
        .then((res) => {
        return res.json();
    })
        .then((res) => {
        likeButton.innerHTML = `${postButtonsImages[0]}${res.likes}`;
        likeButton.classList.replace("react-Post-button", "liked-Post-button");
        likeButton.setAttribute("onclick", `unreactPost('${postInfo}','like')`);
        dislikeButton.innerHTML = `${postButtonsImages[1]}${res.dislikes}`;
        dislikeButton.classList.replace("disliked-Post-button", "react-Post-button");
        dislikeButton.setAttribute("onclick", `dislikePost('${postInfo}')`);
    });
};
const dislikePost = (postInfo) => {
    const likeButton = document.getElementById(`${postInfo}-like`);
    const dislikeButton = likeButton.nextElementSibling;
    const postId = postInfo.split("-")[1];
    const likes = likeButton.innerText;
    const dislikes = dislikeButton.innerText;
    const token = getStringFromCookies("auth-token");
    fetch(`${apiPostUrl}/dislikepost`, {
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "auth-token": token,
        },
        body: JSON.stringify({
            postId: postId,
            disliker: userInfo.email,
            likes: likes,
            dislikes: dislikes,
        }),
        credentials: "same-origin",
    })
        .then((res) => {
        return res.json();
    })
        .then((res) => {
        likeButton.innerHTML = `${postButtonsImages[0]}${res.likes}`;
        likeButton.classList.replace("liked-Post-button", "react-Post-button");
        likeButton.setAttribute("onclick", `likePost('${postInfo}')`);
        dislikeButton.innerHTML = `${postButtonsImages[2]}${res.dislikes}`;
        dislikeButton.classList.replace("react-Post-button", "disliked-Post-button");
        dislikeButton.setAttribute("onclick", `unreactPost('${postInfo}','dislike')`);
    });
};
const unreactPost = (postInfo, reaction) => {
    const likeButton = document.getElementById(`${postInfo}-like`);
    const dislikeButton = likeButton.nextElementSibling;
    const postId = postInfo.split("-")[1];
    const token = getStringFromCookies("auth-token");
    fetch(`${apiPostUrl}/unreactpost`, {
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "auth-token": token,
        },
        body: JSON.stringify({
            postId: postId,
            disliker: userInfo.email,
            reaction: reaction,
        }),
        credentials: "same-origin",
    })
        .then((res) => {
        return res.json();
    })
        .then((res) => {
        likeButton.innerHTML = `${postButtonsImages[0]}${res.likes}`;
        likeButton.classList.replace("liked-Post-button", "react-Post-button");
        likeButton.setAttribute("onclick", `likePost('${postInfo}')`);
        dislikeButton.innerHTML = `${postButtonsImages[1]}${res.dislikes}`;
        dislikeButton.classList.replace("disliked-Post-button", "react-Post-button");
        dislikeButton.setAttribute("onclick", `dislikePost('${postInfo}')`);
    });
};
getOlderPostsBtn.addEventListener("click", (ev) => {
    getAllFriendsPosts(userInfo.email);
});
//# sourceMappingURL=postFunctions.js.map