"use strict";
const profilePictureDisplay = document.getElementById("profilePicture");
const editProfilePicture = document.getElementById("editProfilePicture");
const btnEditPfp = document.getElementById("btnEditPfp");
const profilePictureChooser = document.getElementById("profilePictureChooser");
const saveChosenPfp = document.getElementById("saveChosenPfp");
const avatarUrls = [
    "/img/avatar/battery-avatar.png",
    "/img/avatar/boot-avatar.png",
    "/img/avatar/default-avatar.png",
    "/img/avatar/flower-avatar.png",
    "/img/avatar/heart-avatar.png",
    "/img/avatar/house-avatar.png",
    "/img/avatar/mug-avatar.png",
    "/img/avatar/umbrella-avatar.png",
    "/img/avatar/strawberry-avatar.png",
    "/img/avatar/smiley-avatar.png",
];
let pfpEditModalOpen = false;
let pfpEditSelectedAvatar = "";
const getExistingAvatars = () => {
    avatarUrls.forEach((avatar) => {
        const avatarImage = document.createElement("img");
        avatarImage.setAttribute("src", avatar);
        avatarImage.setAttribute("id", `img-${avatar}`);
        avatarImage.setAttribute("style", `filter: hue-rotate(${pickDefaultAvatarHue(userInfo.username)})`);
        avatarImage.classList.add("avatar-selection-image");
        avatarImage.setAttribute("onclick", `chooseAvatar('${avatar}')`);
        profilePictureChooser.appendChild(avatarImage);
    });
};
const clearAvatarSelectionScreen = () => {
    profilePictureChooser.innerHTML = "";
};
btnEditPfp.addEventListener("change", (ev) => {
    pfpEditModalOpen = !pfpEditModalOpen;
    if (pfpEditModalOpen)
        getExistingAvatars();
    else
        clearAvatarSelectionScreen();
});
const chooseAvatar = (avatar) => {
    var _a;
    const avatarImages = document.getElementsByClassName("avatar-selection-image");
    for (let i = 0; i < avatarImages.length; i++)
        (_a = avatarImages.item(i)) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
    const selectedAvatar = document.getElementById(`img-${avatar}`);
    pfpEditSelectedAvatar = avatar;
    selectedAvatar === null || selectedAvatar === void 0 ? void 0 : selectedAvatar.classList.add("selected");
};
saveChosenPfp.addEventListener("click", (ev) => {
    const token = getStringFromCookies("auth-token");
    const oldPfp = profilePictureDisplay.getAttribute("src");
    fetch(`${apiProfilesUrl}/updatePfp`, {
        method: "POST",
        body: JSON.stringify({
            userEmail: userInfo.email,
            avatar: pfpEditSelectedAvatar,
        }),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "auth-token": token,
        },
        credentials: "same-origin"
    })
        .then((res) => res.json())
        .then((res) => {
        console.log(res, pfpEditSelectedAvatar);
        if (res === oldPfp)
            location.reload();
    });
});
//# sourceMappingURL=ownProfile.js.map