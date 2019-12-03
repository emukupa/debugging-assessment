"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authorize = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.sendStatus(401);
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    // To all detail oriented observers. You'll notice this is
    // not in any way secure or verifyable. You could forge a JWT
    // token and have complete access to this setup. This is not
    // designed to be production ready when it comes to the security
    // aspect. Yet.
    const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
    // @ts-ignore
    req.user = decoded.payload.userId;
    next();
};
//# sourceMappingURL=authorization.js.map