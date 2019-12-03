"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.NoteSchema = new mongoose_1.Schema({
    description: { type: String, required: false, default: "" },
    isPublic: { type: Boolean, default: false },
    recycled: { type: Boolean, default: false },
    sharedWith: [{ type: String }],
    title: { type: String, required: [true, "A title is required!"] },
    userId: { type: String, required: [true, "A user_id is required!"] },
}, {
    timestamps: true
});
exports.Note = mongoose_1.model("Note", exports.NoteSchema);
//# sourceMappingURL=note.schema.js.map