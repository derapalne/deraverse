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

if (!userInfo.username || !userInfo.email) {
    location.pathname = "/signin";
    location.reload();
}
