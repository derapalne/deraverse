"use strict";
const postContentInput = document.getElementById("inputContent");
const postAuthorInput = document.getElementById("inputAuthor");
const submitPostButton = document.getElementById("submitPost");
const friendSuggestions = document.getElementById("friendSuggestions");
const addFriend = (userEmail, friendEmail) => {
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
            const button = document.getElementById("button-add-" + friendEmail);
            button.setAttribute("disabled", "true");
            button.innerText = "Friend Followed";
        }
    })
        .catch((err) => console.log(err));
};
mainTitle.addEventListener("click", (ev) => {
    location.reload();
});
postContentInput.addEventListener("keypress", (ev) => {
    if (ev.code == "Enter" && ev.shiftKey == false) {
        ev.preventDefault();
        submitPostButton.click();
    }
});
submitPostButton.addEventListener("click", (ev) => {
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
        })
            .then((res) => {
            const post = document.createElement("div");
            post.classList.add("post");
            post.setAttribute("id", "temporaryPostLoading");
            const postingText = document.createElement("p");
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
            })
                .catch((err) => console.log(err));
        })
            .catch((err) => console.log(err));
    }
});
getAllFriendsPosts(userInfo.email);
getFriendSuggestions(userInfo.email);
//# sourceMappingURL=main.js.map