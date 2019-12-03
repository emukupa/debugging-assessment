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
const UsersController = __importStar(require("../controllers/users.controller"));
router.post("/register", UsersController.createValidators, UsersController.create);
router.post("/signin", UsersController.signInValidators, UsersController.signIn);
// These routes  are removed from action until an Admin panel
// and strategy can be implemented.
// router.get("/", UsersController.getAll);
// router.get("/:id", authorize, UsersController.getByIdValidators, UsersController.getById);
// router.put("/:id", authorize, UsersController.updateValidators, UsersController.update);
// router.delete("/:id", UsersController.deleteValidators, UsersController.deletePermanently);
exports.default = router;
//# sourceMappingURL=users.routes.js.map