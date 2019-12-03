import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose, { mongo } from "mongoose";
import logger from "morgan";
import path from "path";

import notesRouter from "./routes/notes.routes";
import usersRouter from "./routes/users.routes";

// Setup Mongoose Connection
const dbUrl = "mongodb://localhost:27017/noter";
const mongoDB = process.env.MONGODB_URI || dbUrl;
const db = mongoose.connection;
// tslint:disable-next-line:no-console
db.on("error", console.error.bind(console, "MongoDb Error:"));

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const app = express();

// Cors Configuration
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

// Application/JSON for all requests.
app.use((req, res, next) => {
  res.contentType("application/json");
  next();
});

app.use(logger("dev"));

if (process.env.NODE_ENV !== "test") {
  app.use(cors(corsOptions));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/notes", notesRouter);
app.use("/users", usersRouter);

export default app;
