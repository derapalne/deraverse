"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const node_path_1 = __importDefault(require("node:path"));
const config_js_1 = __importDefault(require("./utils/config.js"));
const app = (0, express_1.default)();
const routes_1 = require("./routes");
const routes_2 = require("./routes");
// settings
app.set("port", config_js_1.default.PORT || 4000);
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
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// view engine & static directory
// app.use(express.static("./public"));
app.use(express_1.default.static(node_path_1.default.join(__dirname + "/public")));
app.set("views", node_path_1.default.join(__dirname + "/views/"));
app.set("view engine", "ejs");
// routes
app.use("/api/auth", routes_1.authRouter);
app.use("/", routes_2.userRouter);
app.use("/", routes_1.postRouter);
app.use("/", routes_1.commentRouter);
app.get('*', (req, res) => {
    res.redirect('/main');
});
exports.default = app;
//# sourceMappingURL=app.js.map