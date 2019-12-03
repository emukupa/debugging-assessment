import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import { IAuthorizedRequest } from "../interfaces/request.interface";
import { authorize } from "../middlewares/authorization";
import { INoteModel, Note } from "../models/note.schema";
import { IUserModel, User } from "../models/user.schema";

/**
 * Get All Notes
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const getAll = (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.sendStatus(400);
    return;
  }

  Note.find({
    $or: [{ userId: req.user, recycled: false }, { sharedWith: req.user }]
  })
    .then((notes: INoteModel[]) => {
      res.json(notes);
    })
    .catch(next);
};

/**
 * Get All Recycled Notes
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const getAllRecycled = (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.sendStatus(400);
    return;
  }

  Note.find({ userId: req.user, recycled: true })
    .then((notes: INoteModel[]) => {
      res.json(notes);
    })
    .catch(next);
};

export const createValidators = [
  check("title", "A title is required for your note!")
    .exists()
    .isString()
    .isLength({ min: 1 })
];

/**
 * Create Note
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const create = (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { description, title } = req.body;
  const newNote = new Note({
    description,
    title,
    userId: req.user
  });

  Note.create(newNote)
    .then((note: INoteModel) => {
      res.status(201).json(note);
    })
    .catch(next);
};

export const getByIdValidators = [
  check("id")
    .exists()
    .isMongoId()
];

/**
 * Get Note By Id
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const getById = (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id: string = req.params.id;

  Note.findById(id)
    .then((note: INoteModel) => {
      // If note not found, return 404
      if (!note) {
        res.sendStatus(404);
        return;
      }

      // If the note is marked as public, bypass
      // authorization check!
      if (note.isPublic) {
        res.json(note);
        return;
      }

      // If note is not shared with or belongs to
      // user in request, return 401
      if (
        note.userId !== req.user &&
        note.sharedWith.indexOf(req.user) === -1
      ) {
        res.sendStatus(401);
        return;
      }

      res.json(note);
    })
    .catch(() => {
      next();
    });
};

export const updateValidators = [
  check("id", "The ID must be passed to update a note.")
    .exists()
    .isMongoId(),
  check("title", "A title is required for your note!")
    .exists()
    .isString()
    .isLength({ min: 1 })
];
/**
 * Update Note
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const update = (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id: string = req.params.id;
  const body = req.body;

  Note.findByIdAndUpdate(
    id,
    {
      description: body.description,
      recycled: body.recycled,
      title: body.title
    },
    { new: true }
  )
    .then((note: INoteModel) => {
      // If note not found, return 404
      if (!note) {
        res.sendStatus(404);
        return;
      }

      // If note is not shared with or belongs to
      // user in request, return 401
      if (note.userId !== req.user) {
        res.sendStatus(401);
        return;
      }

      res.json(note);
    })
    .catch(next);
};

export const recycleValidators = [
  check("id")
    .exists()
    .isMongoId()
];
/**
 * Recycle's Note
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const recycle = async (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id: string = req.params.id;

  const foundNote = await Note.findById(id);

  // If note not found, return 404
  if (!foundNote) {
    res.sendStatus(404);
    return;
  }

  // If note is not shared with or belongs to
  // user in request, return 401
  if (foundNote.userId !== req.user) {
    res.sendStatus(401);
    return;
  }

  foundNote.recycled = true;

  foundNote
    .save()
    .then((note: INoteModel) => {
      res.json(note);
    })
    .catch(next);
};

export const restoreValidators = [
  check("id")
    .exists()
    .isMongoId()
];
/**
 * Recycle's Note
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const restore = async (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id: string = req.params.id;
  const foundNote = await Note.findById(id);

  // If note not found, return 404
  if (!foundNote) {
    res.sendStatus(404);
    return;
  }

  // If note is not shared with or belongs to
  // user in request, return 401
  if (foundNote.userId !== req.user) {
    res.sendStatus(401);
    return;
  }

  foundNote.recycled = false;

  foundNote
    .save()
    .then((note: INoteModel) => {
      res.json(note);
    })
    .catch(next);
};

export const deleteValidators = [
  check("id")
    .exists()
    .isMongoId()
];
/**
 * Delete Note Permanently
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const deletePermanently = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id: string = req.params.id;

  Note.findByIdAndDelete(id).then((note: INoteModel) => {
    if (!note) {
      res.sendStatus(404);
      return;
    }
    res.json(note);
  });
};

export const shareNoteWithUserValidators = [check("email").exists()];
/**
 * Takes an email as a query paramenter and shares the note
 * with that user.
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const shareNoteWithUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id: string = req.params.id;
  const email: string = req.query.email;

  const users: IUserModel[] = await User.find({ email });

  if (users.length === 0) {
    res.status(400).json({ errors: [{ msg: "User not found." }] });
    return;
  }

  const foundNote = await Note.findById(id);
  if (!foundNote) {
    res.status(400).json({ errors: [{ msg: "Note not found." }] });
    return;
  }

  if (foundNote.sharedWith.indexOf(users[0]._id) !== -1) {
    // Note is already shared.
    res.json(foundNote);
    return;
  }

  foundNote.sharedWith.push(users[0]._id);

  foundNote
    .save()
    .then((note: INoteModel) => {
      res.json(note);
    })
    .catch(next);
};
