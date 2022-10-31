const profilePictureContainer = document.getElementById("profilePictureContainer")! as HTMLDivElement;
const profilePicture = document.getElementById("profilePicture")! as HTMLImageElement;
const profileUsername = document.getElementById("profileUserName")! as HTMLElement;


profilePicture.setAttribute("style", `filter: hue-rotate(${pickDefaultAvatarHue(profileUsername.innerText)})`);


const getUsersPosts = (user: string) => {
    const token = getStringFromCookies("auth-token");
    fetch(`${apiPostUrl}/?profileEmail=${user}&userEmail=${userInfo.email}`, {
        method: "GET",
        headers: {
            "auth-token": token,
        },
        credentials: "same-origin",
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            for (let p = 0; p < res.length; p++) {
                const post: HTMLDivElement = document.createElement("div");
                post.classList.add("post");
                post.setAttribute("id", `${res[p].post.author}-${res[p].post.timestamp}`);
                post.innerHTML = formPost(res[p]);
                mainFeed.insertBefore(post, mainFeed.firstChild);
            }
        });
};

getUsersPosts(location.pathname.replace("/profiles/", ""));
getFriendSuggestions(userInfo.email);
