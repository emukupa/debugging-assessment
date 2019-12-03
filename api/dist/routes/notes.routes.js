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
const authorization_1 = require("../middlewares/authorization");
const router = express_1.default.Router();
const NotesController = __importStar(require("../controllers/notes.controller"));
router.get("/", authorization_1.authorize, NotesController.getAll);
router.get("/recycled", authorization_1.authorize, NotesController.getAllRecycled);
router.get("/:id", authorization_1.authorize, NotesController.getByIdValidators, NotesController.getById);
router.post("/", authorization_1.authorize, NotesController.createValidators, NotesController.create);
router.put("/:id", authorization_1.authorize, NotesController.updateValidators, NotesController.update);
router.post("/:id/share", authorization_1.authorize, NotesController.shareNoteWithUserValidators, NotesController.shareNoteWithUser);
router.post("/:id/recycle", authorization_1.authorize, NotesController.recycleValidators, NotesController.recycle);
router.post("/:id/restore", authorization_1.authorize, NotesController.restoreValidators, NotesController.restore);
router.delete("/:id", authorization_1.authorize, NotesController.deleteValidators, NotesController.deletePermanently);
exports.default = router;
//# sourceMappingURL=notes.routes.js.map