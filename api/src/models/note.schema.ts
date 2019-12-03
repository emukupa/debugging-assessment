import { Document, Model, model, Schema } from "mongoose";
import { INote } from "../interfaces/note.interface";

export interface INoteModel extends INote, Document {}

export let NoteSchema: Schema = new Schema(
  {
    description: { type: String, required: false, default: "" },
    isPublic: { type: Boolean, default: false },
    recycled: { type: Boolean, default: false },
    sharedWith: [{ type: String }],
    title: { type: String, required: [true, "A title is required!"] },
    userId: { type: String, required: [true, "A user_id is required!"] },
  },
  {
    timestamps: true
  }
);

export const Note: Model<INoteModel> = model<INoteModel>("Note", NoteSchema);
