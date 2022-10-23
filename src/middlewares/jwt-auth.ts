import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const separateAndGetCookie = (cookiesFromHeader: string, cookieToFind: string): string => {
    const cookies = cookiesFromHeader.split(";");
    let foundCookie = "";
    cookies.forEach((cookie) => {
        if (cookie.slice(0, cookieToFind.length) === cookieToFind) foundCookie = cookie.slice(11);
    });
    return foundCookie;
};

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth-token"] || req.headers["auth-token"];
    if (token) {
        const authorized = jwt.verify(token, process.env.TOKEN_SECRET || "azurillTest");
        if (authorized) {
            return next();
        }
    }
    return res.status(403).redirect("/signin");
};

const isNotAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("auth-token");
    if (token) {
        const authorized = jwt.verify(token, process.env.TOKEN_SECRET || "azurillTest");
        if (authorized) {
            return res.status(403).redirect("/profile");
        }
    }
    return next();
};

export { isAuth, isNotAuth };
