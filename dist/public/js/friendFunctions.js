"use strict";
const formFriendSuggestions = (friends, userEmail) => {
    friends.forEach((friend) => {
        console.log(friend);
        const friendDiv = document.createElement("div");
        const friendName = document.createElement("h4");
        friendName.innerText = friend.username;
        const linkToProfile = document.createElement("a");
        linkToProfile.setAttribute("href", `/profiles/${friend.email}`);
        linkToProfile.appendChild(friendName);
        const addButton = document.createElement("button");
        addButton.setAttribute("onclick", `addFriend("${userEmail}", "${friend.email}")`);
        addButton.setAttribute("id", "button-add-" + friend.email);
        addButton.innerText = "Follow Friend";
        friendDiv.appendChild(linkToProfile);
        friendDiv.appendChild(addButton);
        friendSuggestions.appendChild(friendDiv);
    });
};
const getAllFriendsPosts = (user) => {
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
            const post = document.createElement("div");
            post.classList.add("post");
            post.setAttribute("id", `${res[p].post.author}-${res[p].post.timestamp}`);
            post.innerHTML = formPost(res[p]);
            mainFeed.insertBefore(post, mainFeed.firstChild);
        }
    });
};
const getFriendSuggestions = (user) => {
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
//# sourceMappingURL=friendFunctions.js.map