"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const NoteSchema = new Schema({
    description: { type: String, required: false },
    title: { type: String, required: true, max: 150 },
});
exports.default = mongoose_1.default.Model("Note", NoteSchema);
//# sourceMappingURL=note.model.js.map