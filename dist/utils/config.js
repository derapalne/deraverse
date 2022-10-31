"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    PORT: process.env.PORT || 4000,
    MONGO_DB_URL: process.env.MONGO_DB_URL || "mongodb://localhost/deraverse"
};
//# sourceMappingURL=config.js.map