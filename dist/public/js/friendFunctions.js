"use strict";
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
const formFriendSuggestions = (friends, userEmail) => {
    friends.forEach((friend) => {
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