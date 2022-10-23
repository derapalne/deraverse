const postContentInput = document.getElementById("inputContent")! as HTMLInputElement;
const postAuthorInput = document.getElementById("inputAuthor")! as HTMLInputElement;
const submitPostButton = document.getElementById("submitPost")! as HTMLInputElement;
const mainFeed = document.getElementById("mainFeed")! as HTMLDivElement;
const friendSuggestions = document.getElementById("friendSuggestions")! as HTMLDivElement;

const apiPostUrl = "http://127.0.0.1:4000/api/post";
const apiProfilesUrl = "http://127.0.0.1:4000/api/profiles";

const likeUrl = "<img src='/img/like.png' class='react-img'></img>";
const dislikeUrl = "<img src='/img/dislike.png' class='react-img'></img>";
const dislikeLightUrl = "<img src='/img/dislikeLight.png' class='react-img'></img>";

const getDate = (): string => {
    const date = new Date();
    return `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
};

const getStringFromCookies = (value: string): string => {
    const cookies = document.cookie.split(";");
    let string: string = "";
    cookies.forEach((cookie) => {
        if (cookie.trim().slice(0, value.length) === value) {
            string = cookie.trim().slice(11);
        }
    });
    return string;
};

const getObjectFromCookies = (value: string): any => {
    const cookies = document.cookie.split("; ");
    let response = {};
    cookies.forEach((cookie) => {
        if (cookie.trim().slice(0, value.length) === value) {
            const current = cookie.toString().split("=");
            response = JSON.parse(decodeURIComponent(current[1]).replace("j:", ""));
        }
    });
    return response;
};

const userInfo = getObjectFromCookies("userInfo");
console.log(userInfo);

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
    <h4>${post.username} - <small>${post.date}</small></h4>
    <pre>${post.content}</pre>
    <div>
      <button class="${likeButtonClass}" id="${post.author}-${post._id}-like" onclick="${likeButtonOnclick}" >${likeUrl}${likes}</button>
      <button class="${dislikeButtonClass}" id="${post.author}-${post._id}-dislike" onclick="${dislikeButtonOnclick}" >${dislikeImage}${dislikes}</button>
    </div>
    <span></span>
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
            dislikeButton.classList.replace("react-button", "react-button");
            dislikeButton.setAttribute("onclick", `dislikePost('${postInfo}')`);
        });
};

const formFriendSuggestions = (friends: { username: string; email: string }[], userEmail: string) => {
    friends.forEach((friend) => {
        const friendDiv = document.createElement("div");
        const friendName = document.createElement("h4");
        friendName.innerText = friend.username;
        const addButton = document.createElement("button");
        addButton.setAttribute("onclick", `addFriend("${userEmail}", "${friend.email}")`);
        addButton.setAttribute("id", "button-add-" + friend.email);
        addButton.innerText = "Add Friend";
        friendDiv.appendChild(friendName);
        friendDiv.appendChild(addButton);
        friendSuggestions.appendChild(friendDiv);
    });
};

const addFriend = (userEmail: string, friendEmail: string) => {
    const token = getStringFromCookies("auth-token");
    fetch(`${apiProfilesUrl}/addfriend`, {
        mode: "cors",
        method: "POST",
        body: JSON.stringify({
            userEmail: userEmail,
            friendEmail: friendEmail,
        }),
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "auth-token": token,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            if (res.addedFriend === friendEmail) {
                const button = document.getElementById("button-add-" + friendEmail)!;
                button.setAttribute("disabled", "true");
                button.innerText = "Friend Added";
            }
        });
};

postContentInput.addEventListener("keypress", (ev: KeyboardEvent) => {
    if (ev.code == "Enter" && ev.shiftKey == false) {
        ev.preventDefault();
        submitPostButton.click();
    }
});

submitPostButton.addEventListener("click", (ev: MouseEvent) => {
    ev.preventDefault();
    const content = postContentInput.value;
    postContentInput.value = "";
    if (content) {
        const author = postAuthorInput.value;
        const date = getDate();
        const token = getStringFromCookies("auth-token");
        fetch(apiPostUrl, {
            mode: "cors",
            method: "POST",
            body: JSON.stringify({
                author: author,
                content: content,
                date: date,
                timestamp: Date.now(),
            }),
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
                "auth-token": token,
            },
        }).then((res) => {
            const post: HTMLDivElement = document.createElement("div");
            post.classList.add("post");
            post.setAttribute("id", "temporaryPostLoading");
            const postingText: HTMLParagraphElement = document.createElement("p");
            if (res.statusText !== "Created") {
                postingText.innerText = "There has been an error, try again";
                post.appendChild(postingText);
                mainFeed.insertBefore(post, mainFeed.firstChild);
                return;
            }
            postingText.innerText = "Your post is being published";
            post.appendChild(postingText);
            mainFeed.insertBefore(post, mainFeed.firstChild);
            fetch(`${apiPostUrl}/lastpublishedpost?user=${author}`, {
                method: "GET",
                headers: {
                    "auth-token": token,
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    post.setAttribute("id", `${res.author}-${res.timestamp}`);
                    post.innerHTML = formPost(res);
                });
        });
    }
});

const getAllFriendsPosts = (user: string) => {
    const token = getStringFromCookies("auth-token");
    fetch(`${apiPostUrl}/friendsposts?user=${user}`, {
        method: "GET",
        headers: {
            "auth-token": token,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            for (let p = 0; p < res.length; p++) {
                const post: HTMLDivElement = document.createElement("div");
                post.classList.add("post");
                post.setAttribute("id", `${res[p].author}-${res[p].timestamp}`);
                post.innerHTML = formPost(res[p]);
                mainFeed.insertBefore(post, mainFeed.firstChild);
            }
        });
};

const getFriendSuggestions = (user: string) => {
    const token = getStringFromCookies("auth-token");
    fetch(`${apiProfilesUrl}/notfriends?user=${user}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "auth-token": token,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            formFriendSuggestions(res, userInfo.email);
        });
};

getAllFriendsPosts(userInfo.email);
getFriendSuggestions(userInfo.email);
