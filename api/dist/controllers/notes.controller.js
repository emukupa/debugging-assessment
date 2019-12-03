"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
const note_schema_1 = require("../models/note.schema");
const user_schema_1 = require("../models/user.schema");
/**
 * Get All Notes
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
exports.getAll = (req, res, next) => {
    if (!req.user) {
        res.sendStatus(400);
        return;
    }
    note_schema_1.Note.find({
        $or: [{ userId: req.user, recycled: false }, { sharedWith: req.user }]
    })
        .then((notes) => {
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
exports.getAllRecycled = (req, res, next) => {
    if (!req.user) {
        res.sendStatus(400);
        return;
    }
    note_schema_1.Note.find({ userId: req.user, recycled: true })
        .then((notes) => {
        res.json(notes);
    })
        .catch(next);
};
exports.createValidators = [
    check_1.check("title", "A title is required for your note!")
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
exports.create = (req, res, next) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { description, title } = req.body;
    const newNote = new note_schema_1.Note({
        description,
        title,
        userId: req.user
    });
    note_schema_1.Note.create(newNote)
        .then((note) => {
        res.status(201).json(note);
    })
        .catch(next);
};
exports.getByIdValidators = [
    check_1.check("id")
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
exports.getById = (req, res, next) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const id = req.params.id;
    note_schema_1.Note.findById(id)
        .then((note) => {
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
        if (note.userId !== req.user &&
            note.sharedWith.indexOf(req.user) === -1) {
            res.sendStatus(401);
            return;
        }
        res.json(note);
    })
        .catch(() => {
        next();
    });
};
exports.updateValidators = [
    check_1.check("id", "The ID must be passed to update a note.")
        .exists()
        .isMongoId(),
    check_1.check("title", "A title is required for your note!")
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
exports.update = (req, res, next) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const id = req.params.id;
    const body = req.body;
    note_schema_1.Note.findByIdAndUpdate(id, {
        description: body.description,
        recycled: body.recycled,
        title: body.title
    }, { new: true })
        .then((note) => {
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
exports.recycleValidators = [
    check_1.check("id")
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
exports.recycle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const id = req.params.id;
    const foundNote = yield note_schema_1.Note.findById(id);
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
        .then((note) => {
        res.json(note);
    })
        .catch(next);
});
exports.restoreValidators = [
    check_1.check("id")
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
exports.restore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const id = req.params.id;
    const foundNote = yield note_schema_1.Note.findById(id);
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
        .then((note) => {
        res.json(note);
    })
        .catch(next);
});
exports.deleteValidators = [
    check_1.check("id")
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
exports.deletePermanently = (req, res, next) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const id = req.params.id;
    note_schema_1.Note.findByIdAndDelete(id).then((note) => {
        if (!note) {
            res.sendStatus(404);
            return;
        }
        res.json(note);
    });
};
exports.shareNoteWithUserValidators = [check_1.check("email").exists()];
/**
 * Takes an email as a query paramenter and shares the note
 * with that user.
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
exports.shareNoteWithUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const id = req.params.id;
    const email = req.query.email;
    const users = yield user_schema_1.User.find({ email });
    if (users.length === 0) {
        res.status(400).json({ errors: [{ msg: "User not found." }] });
        return;
    }
    const foundNote = yield note_schema_1.Note.findById(id);
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
        .then((note) => {
        res.json(note);
    })
        .catch(next);
});
//# sourceMappingURL=notes.controller.js.map