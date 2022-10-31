import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import path from "node:path";
import config from "./utils/config.js";

const app: Application = express();

import { authRouter, postRouter } from "./routes";
import { userRouter } from "./routes";

// settings
app.set("port", config.PORT || 4000);
// mover a utils
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200,
    allowedHeaders: [
        "Content-Type",
        "Access-Control-Allow-Headers",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
        "Access-Control-Allow-Credentials",
        "auth-token",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    maxAge: 86400,
};

// middlewares
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// view engine & static directory
// app.use(express.static("./public"));
app.use(express.static(path.join(__dirname + "/public")));
app.set("views", path.join(__dirname + "/views/"));
app.set("view engine", "ejs");

// routes
app.use("/api/auth", authRouter);
app.use("/", userRouter);
app.use("/", postRouter);

app.get('*', (req: Request, res: Response) => {
    res.redirect('/main');
});

export default app;
