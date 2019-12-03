"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String },
}, {
    timestamps: true
});
exports.User = mongoose_1.model("User", exports.UserSchema);
//# sourceMappingURL=user.schema.js.map