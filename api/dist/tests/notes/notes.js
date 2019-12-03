"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = "test";
const note_schema_1 = require("../../models/note.schema");
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
chai_1.default.use(chai_http_1.default);
describe("Notes", () => {
    beforeEach((done) => {
        note_schema_1.Note.remove({}, (err) => {
            done();
        });
    });
});
//# sourceMappingURL=notes.js.map