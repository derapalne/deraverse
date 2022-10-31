"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_js_1 = __importDefault(require("./utils/config.js"));
mongoose_1.default
    .connect(config_js_1.default.MONGO_DB_URL)
    .then((db) => console.log("Database connected"))
    .catch((err) => console.log(err));
//# sourceMappingURL=database.js.map