import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import jwt from "jsonwebtoken";
import { IUserModel, User } from "../models/user.schema";

/**
 * Get All Users
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const getAll = (req: Request, res: Response, next: NextFunction) => {
  User.find({}, ["name", "email", "createdAt", "updatedAt", "_id"])
    .then((users: IUserModel[]) => {
      res.json(users);
    })
    .catch(next);
};

export const signInValidators = [
  check("email", "E-Mail is required.").exists(),
  check("email", "E-Mail must be a valid email.").isEmail(),
  check("password", "Password is required.").exists()
];

/**
 * Sign In User
 *
 * @param req {Request} Express Request Object
 * @param res  {Response} Express Response Object
 * @param next {NextFunction} Next Function to continue
 */
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const secret = process.env.JWT_SECRET || "secret";
    // To all detail oriented observers. You'll notice this is
    // not in any way secure or verifyable. You could forge a JWT
    // token and have complete access to this setup. This is not
    // designed to be production ready when it comes to the security
    // aspect. Yet.
    const token = jwt.sign({ userId: user._id, userName: user.name }, secret, {
      expiresIn: "2 days"
    });

    res.status(200).json({ token });
    return;
  }

  res
    .status(400)
    .json({ errors: [{ msg: "E-Mail or Password is incorrect." }] });
};

export const createValidators = [
  check("email", "E-Mail is required.")
    .exists()
    .isEmail(),
  check(
    "password",
    "Password is required and must be at least 8 characters long."
  )
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
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, name, password } = req.body;

  // Check for duplicates.
  const existingUsers = await User.find({ email });
  if (existingUsers.length > 0) {
    res
      .status(400)
      .json({ errors: [{ msg: "A user with that email already exists!" }] });
    return;
  }

  const newUser = new User({
    email,
    name,
    passwordHash: bcrypt.hashSync(password, 10)
  });

  User.create(newUser)
    .then((user: IUserModel) => {
      res.status(201).json({
        _id: user.id,
        email,
        name
      });
    })
    .catch(next);
};

export const getByIdValidators = [
  check("id")
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
export const getById = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id: string = req.params.id;

  User.findById(id, ["name", "email", "createdAt", "updatedAt", "_id"])
    .then((user: IUserModel) => {
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

export const updateValidators = [
  check("id", "The ID must be passed to update a user.")
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
export const update = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id: string = req.params.id;
  const { name } = req.body;

  User.findByIdAndUpdate(
    id,
    {
      name
    },
    { new: true }
  )
    .then((user: IUserModel) => {
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

export const deleteValidators = [
  check("id")
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

  User.findByIdAndDelete(id)
    .then((user: IUserModel) => {
      if (!user) {
        res.sendStatus(404);
        return;
      }
      res.json(user);
    })
    .catch(next);
};
