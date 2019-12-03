import express from "express";
import { authorize } from "../middlewares/authorization";
const router = express.Router();

import * as UsersController from "../controllers/users.controller";

router.post(
  "/register",
  UsersController.createValidators,
  UsersController.create
);
router.post(
  "/signin",
  UsersController.signInValidators,
  UsersController.signIn
);

// These routes  are removed from action until an Admin panel
// and strategy can be implemented.

// router.get("/", UsersController.getAll);
// router.get("/:id", authorize, UsersController.getByIdValidators, UsersController.getById);
// router.put("/:id", authorize, UsersController.updateValidators, UsersController.update);
// router.delete("/:id", UsersController.deleteValidators, UsersController.deletePermanently);

export default router;
