import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

export interface IUserModel extends IUser, Document {}

export let UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String },
  },
  {
    timestamps: true
  }
);

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);
