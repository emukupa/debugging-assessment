import express from "express";
import { authorize } from "../middlewares/authorization";
const router = express.Router();

import * as NotesController from "../controllers/notes.controller";

router.get("/", authorize, NotesController.getAll);
router.get("/recycled", authorize, NotesController.getAllRecycled);
router.get(
  "/:id",
  authorize,
  NotesController.getByIdValidators,
  NotesController.getById
);
router.post(
  "/",
  authorize,
  NotesController.createValidators,
  NotesController.create
);
router.put(
  "/:id",
  authorize,
  NotesController.updateValidators,
  NotesController.update
);
router.post(
  "/:id/share",
  authorize,
  NotesController.shareNoteWithUserValidators,
  NotesController.shareNoteWithUser
);
router.post(
  "/:id/recycle",
  authorize,
  NotesController.recycleValidators,
  NotesController.recycle
);
router.post(
  "/:id/restore",
  authorize,
  NotesController.restoreValidators,
  NotesController.restore
);
router.delete(
  "/:id",
  authorize,
  NotesController.deleteValidators,
  NotesController.deletePermanently
);

export default router;
