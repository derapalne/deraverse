const apiPostUrl = `${location.origin}/api/post`;
const apiProfilesUrl = `${location.origin}/api/profiles`;

console.log(apiPostUrl);

const mainTitle = document.getElementById("mainTitle")! as HTMLHeadElement;
const mainFeed = document.getElementById("mainFeed")! as HTMLDivElement;


const getDate = (): string => {
    const date = new Date();
    return `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
};

const pickDefaultAvatarHue = (username: string): string => {
    const firstChar = username[0];
    const factor = parseInt(firstChar, 36) - 13;
    return `${factor * 13.846}deg`;
};


