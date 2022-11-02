"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogOut = exports.postSignIn = exports.postSignUp = void 0;
const models_1 = require("../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield models_1.UserModel.findOne({ email: req.body.email });
    if (exists)
        return res.status(403).json("User already exists");
    // Creando usuario
    const user = new models_1.UserModel({
        username: req.body.username.trim(),
        email: req.body.email.trim(),
        password: req.body.password,
        friendlist: [req.body.email.trim()],
        followers: [],
        avatar: "/img/avatar/default-avatar.png",
    });
    user.password = yield user.encryptPassword(user.password);
    // Guardando usuario
    const savedUser = yield user.save();
    // Creando token
    const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET || "azurillTest");
    // Guardar en cookies
    res.cookie("auth-token", token, { maxAge: 24 * 60 * 60 * 1000 });
    const userInfo = {
        username: user.username,
        email: user.email,
    };
    res.cookie("userInfo", userInfo, { maxAge: 24 * 60 * 60 * 1000 });
    // Responder al cliente
    res.redirect("../../main");
});
exports.postSignUp = postSignUp;
const postSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.UserModel.findOne({ email: req.body.email });
    if (!user)
        return res.status(403).json("Email or password wrong");
    const passOk = yield user.validatePassword(req.body.password);
    if (!passOk)
        return res.status(403).json("Email or password wrong");
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET || "azurillTest", {
        expiresIn: 60 * 60 * 24,
    });
    res.cookie("auth-token", token, { maxAge: 24 * 60 * 60 * 1000 });
    const userInfo = {
        username: user.username,
        email: user.email,
    };
    res.cookie("userInfo", userInfo, { maxAge: 24 * 60 * 60 * 1000 });
    res.redirect("../../main");
});
exports.postSignIn = postSignIn;
const postLogOut = (req, res) => {
    res.clearCookie("userInfo");
    res.clearCookie("auth-token");
    res.redirect("../../signin");
};
exports.postLogOut = postLogOut;
//# sourceMappingURL=auth.controller.js.map