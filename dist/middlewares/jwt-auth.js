"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotAuth = exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const separateAndGetCookie = (cookiesFromHeader, cookieToFind) => {
    const cookies = cookiesFromHeader.split(";");
    let foundCookie = "";
    cookies.forEach((cookie) => {
        if (cookie.slice(0, cookieToFind.length) === cookieToFind)
            foundCookie = cookie.slice(11);
    });
    return foundCookie;
};
const isAuth = (req, res, next) => {
    console.log("Autenticando...");
    const token = req.cookies["auth-token"] || req.headers["auth-token"];
    if (token) {
        const authorized = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || "azurillTest");
        if (authorized) {
            return next();
        }
    }
    return res.status(403).redirect("/signin");
};
exports.isAuth = isAuth;
const isNotAuth = (req, res, next) => {
    const token = req.header("auth-token");
    if (token) {
        const authorized = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || "azurillTest");
        if (authorized) {
            return res.status(403).redirect("/profile");
        }
    }
    return next();
};
exports.isNotAuth = isNotAuth;
//# sourceMappingURL=jwt-auth.js.map