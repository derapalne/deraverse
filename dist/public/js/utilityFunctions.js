"use strict";
const apiPostUrl = `${location.origin}/api/post`;
const apiProfilesUrl = `${location.origin}/api/profiles`;
console.log(apiPostUrl);
const mainTitle = document.getElementById("mainTitle");
const mainFeed = document.getElementById("mainFeed");
const getDate = () => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
};
const pickDefaultAvatarHue = (username) => {
    const firstChar = username[0];
    const factor = parseInt(firstChar, 36) - 13;
    return `${factor * 13.846}deg`;
};
//# sourceMappingURL=utilityFunctions.js.map