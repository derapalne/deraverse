const likeUrl = "<img src='/img/like.png' class='react-img'></img>";
const dislikeUrl = "<img src='/img/dislike.png' class='react-img'></img>";
const dislikeLightUrl = "<img src='/img/dislikeLight.png' class='react-img'></img>";

const formPost = (data: {
    post: {
        author: string;
        username: string;
        content: string;
        date: string;
        timestamp: number;
        likes: string[];
        dislikes: string[];
        _id: number;
    };
    status: number;
    authorAvatar: string;
}): string => {
    const post = data.post;
    const likes = post.likes[0] == "0" ? "0" : post.likes.length.toString();
    const dislikes = post.dislikes[0] == "0" ? "0" : post.dislikes.length.toString();
    let likeButtonClass = "react-button like";
    let likeButtonOnclick = `likePost('${post.author}-${post._id}')`;
    let dislikeButtonClass = "react-button dislike";
    let dislikeButtonOnclick = `dislikePost('${post.author}-${post._id}')`;
    let dislikeImage = dislikeUrl;
    switch (data.status) {
        case 1:
            likeButtonClass = "liked-button";
            likeButtonOnclick = `unreactPost('${post.author}-${post._id}','like')`;
            break;
        case 2:
            dislikeButtonClass = "disliked-button";
            dislikeButtonOnclick = `unreactPost('${post.author}-${post._id}','dislike')`;
            dislikeImage = dislikeLightUrl;
            break;
    }
    return `<div>
    <a href="/profiles/${post.author}">
        <div class="post-profile-info">
            <img src="${
                data.authorAvatar
            }" class="profile-picture" style="filter: hue-rotate(${pickDefaultAvatarHue(
        post.username
    )});"></img>
    <h4 class="middle-align">${post.username}</h4>
        </div>
    </a> 
    <pre>${post.content}</pre>
    <div>
      <button class="${likeButtonClass}" id="${post.author}-${
        post._id
    }-like" onclick="${likeButtonOnclick}" >${likeUrl}${likes}</button>
      <button class="${dislikeButtonClass}" id="${post.author}-${
        post._id
    }-dislike" onclick="${dislikeButtonOnclick}" >${dislikeImage}${dislikes}</button>
    <small class="post-date">${post.date}</small>
    </div>
  </div>`;
};

const likePost = (postInfo: string) => {
    const likeButton = document.getElementById(`${postInfo}-like`) as HTMLButtonElement;
    const dislikeButton = likeButton.nextElementSibling as HTMLButtonElement;
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
            likeButton.innerHTML = `${likeUrl}${res.likes}`;
            likeButton.classList.replace("react-button", "liked-button");
            likeButton.setAttribute("onclick", `unreactPost('${postInfo}','like')`);
            dislikeButton.innerHTML = `${dislikeUrl}${res.dislikes}`;
            dislikeButton.classList.replace("disliked-button", "react-button");
            dislikeButton.setAttribute("onclick", `dislikePost('${postInfo}')`);
        });
};

const dislikePost = (postInfo: string) => {
    const likeButton = document.getElementById(`${postInfo}-like`) as HTMLButtonElement;
    const dislikeButton = likeButton.nextElementSibling as HTMLButtonElement;
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
            likeButton.innerHTML = `${likeUrl}${res.likes}`;
            likeButton.classList.replace("liked-button", "react-button");
            likeButton.setAttribute("onclick", `likePost('${postInfo}')`);
            dislikeButton.innerHTML = `${dislikeLightUrl}${res.dislikes}`;
            dislikeButton.classList.replace("react-button", "disliked-button");
            dislikeButton.setAttribute("onclick", `unreactPost('${postInfo}','dislike')`);
        });
};

const unreactPost = (postInfo: string, reaction: string) => {
    const likeButton = document.getElementById(`${postInfo}-like`) as HTMLButtonElement;
    const dislikeButton = likeButton.nextElementSibling as HTMLButtonElement;
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
            likeButton.innerHTML = `${likeUrl}${res.likes}`;
            likeButton.classList.replace("liked-button", "react-button");
            likeButton.setAttribute("onclick", `likePost('${postInfo}')`);
            dislikeButton.innerHTML = `${dislikeUrl}${res.dislikes}`;
            dislikeButton.classList.replace("disliked-button", "react-button");
            dislikeButton.setAttribute("onclick", `dislikePost('${postInfo}')`);
        });
};
