"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const NotesController = __importStar(require("../controllers/notes.controller"));
router.get("/", NotesController.getAll);
router.get("/:id", NotesController.getById);
router.post("/", NotesController.create);
router.put("/:id", NotesController.update);
router.post("/:id/recycle", NotesController.recycle);
router.delete("/:id", NotesController.deletePermanently);
exports.default = router;
//# sourceMappingURL=notes.js.map