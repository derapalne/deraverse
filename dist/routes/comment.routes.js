"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.commentRouter = router;
const controllers_1 = require("../controllers");
const jwt_auth_1 = require("../middlewares/jwt-auth");
router.post("/api/comment", jwt_auth_1.isAuth, controllers_1.postPostComment);
//# sourceMappingURL=comment.routes.js.map