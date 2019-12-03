"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const check_1 = require("express-validator/check");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../models/user.schema");
/**
 * Get All Users
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
exports.getAll = (req, res, next) => {
    user_schema_1.User.find({}, ["name", "email", "createdAt", "updatedAt", "_id"])
        .then((users) => {
        res.json(users);
    })
        .catch(next);
};
exports.signInValidators = [
    check_1.check("email", "E-Mail is required.").exists(),
    check_1.check("email", "E-Mail must be a valid email.").isEmail(),
    check_1.check("password", "Password is required.").exists()
];
/**
 * Sign In User
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
exports.signIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    const user = yield user_schema_1.User.findOne({ email });
    if (user && bcrypt_1.default.compareSync(password, user.passwordHash)) {
        const secret = process.env.JWT_SECRET || "secret";
        // To all detail oriented observers. You'll notice this is
        // not in any way secure or verifyable. You could forge a JWT
        // token and have complete access to this setup. This is not
        // designed to be production ready when it comes to the security
        // aspect. Yet.
        const token = jsonwebtoken_1.default.sign({ userId: user._id, userName: user.name }, secret, {
            expiresIn: "2 days"
        });
        res.status(200).json({ token });
        return;
    }
    res
        .status(400)
        .json({ errors: [{ msg: "E-Mail or Password is incorrect." }] });
});
exports.createValidators = [
    check_1.check("email", "E-Mail is required.")
        .exists()
        .isEmail(),
    check_1.check("password", "Password is required and must be at least 8 characters long.")
        .exists()
        .isLength({ min: 8 })
];
/**
 * Create User
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
exports.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, name, password } = req.body;
    // Check for duplicates.
    const existingUsers = yield user_schema_1.User.find({ email });
    if (existingUsers.length > 0) {
        res
            .status(400)
            .json({ errors: [{ msg: "A user with that email already exists!" }] });
        return;
    }
    const newUser = new user_schema_1.User({
        email,
        name,
        passwordHash: bcrypt_1.default.hashSync(password, 10)
    });
    user_schema_1.User.create(newUser)
        .then((user) => {
        res.status(201).json({
            _id: user.id,
            email,
            name
        });
    })
        .catch(next);
});
exports.getByIdValidators = [
    check_1.check("id")
        .exists()
        .isMongoId()
];
/**
 * Get User By Id
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
    user_schema_1.User.findById(id, ["name", "email", "createdAt", "updatedAt", "_id"])
        .then((user) => {
        if (!user) {
            res.sendStatus(404);
            return;
        }
        res.json(user);
    })
        .catch(error => {
        next();
    });
};
exports.updateValidators = [
    check_1.check("id", "The ID must be passed to update a user.")
        .exists()
        .isMongoId()
];
/**
 * Update User
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
    const { name } = req.body;
    user_schema_1.User.findByIdAndUpdate(id, {
        name
    }, { new: true })
        .then((user) => {
        if (!user) {
            res.sendStatus(404);
            return;
        }
        res.json({
            _id: user.id,
            email: user.email,
            name: user.name
        });
    })
        .catch(next);
};
exports.deleteValidators = [
    check_1.check("id")
        .exists()
        .isMongoId()
];
/**
 * Delete User
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
    user_schema_1.User.findByIdAndDelete(id)
        .then((user) => {
        if (!user) {
            res.sendStatus(404);
            return;
        }
        res.json(user);
    })
        .catch(next);
};
//# sourceMappingURL=users.controller.js.map