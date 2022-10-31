const apiPostUrl = "http://127.0.0.1:4000/api/post";
const apiProfilesUrl = "http://127.0.0.1:4000/api/profiles";

const mainTitle = document.getElementById("mainTitle")! as HTMLHeadElement;
const mainFeed = document.getElementById("mainFeed")! as HTMLDivElement;


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

const pickDefaultAvatarHue = (username: string): string => {
    const firstChar = username[0];
    const factor = parseInt(firstChar, 36) - 13;
    return `${factor * 13.846}deg`;
};

const userInfo = getObjectFromCookies("userInfo");
