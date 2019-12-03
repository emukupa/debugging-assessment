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
process.env.NODE_ENV = "test";
const note_schema_1 = require("../../models/note.schema");
const user_schema_1 = require("../../models/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const app_1 = __importDefault(require("../../app"));
const should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
const authorizeUser1 = (done) => {
    chai_1.default
        .request(app_1.default)
        .post("/users/signin")
        .send({
        email: "example@example.com",
        password: "eightcharacterpassword"
    })
        .end((err, res) => {
        res.should.have.status(200);
        done(res.body.token);
    });
};
const seedUsersAndNotes = () => __awaiter(this, void 0, void 0, function* () {
    const users = [
        new user_schema_1.User({
            email: "example@example.com",
            name: "Thomas Evans",
            passwordHash: bcrypt_1.default.hashSync("eightcharacterpassword", 10)
        }),
        new user_schema_1.User({
            email: "blarg@example.com",
            name: "James Avery",
            passwordHash: bcrypt_1.default.hashSync("eightcharacterpassword", 10)
        })
    ];
    const UserRequests = users.map((user) => {
        return user_schema_1.User.create(user);
    });
    yield Promise.all(UserRequests);
    const notes = [
        new note_schema_1.Note({
            description: "Belongs to User 1",
            title: "Test Note User 1",
            userId: users[0]._id
        }),
        new note_schema_1.Note({
            description: "Belongs to User 1",
            title: "Test Note 2 User 1",
            userId: users[0]._id
        }),
        new note_schema_1.Note({
            description: "Belongs to User 1",
            isPublic: true,
            title: "Test Note 3 User 1",
            userId: users[0]._id
        }),
        new note_schema_1.Note({
            description: "Belongs to User 2",
            sharedWith: [users[0]._id],
            title: "Test Note User 2",
            userId: users[1]._id
        }),
        new note_schema_1.Note({
            description: "Belongs to User 2",
            isPublic: true,
            title: "Test Public Note User 2",
            userId: users[1]._id
        }),
        new note_schema_1.Note({
            description: "Belongs to User 2",
            title: "Test Non shared Non Public Note User 2",
            userId: users[1]._id
        })
    ];
    const allNoteRequests = notes.map((note) => {
        return note_schema_1.Note.create(note);
    });
    yield Promise.all(allNoteRequests);
    return Promise.resolve({ users, notes });
});
describe("Notes", () => {
    // List of Notes
    let notes;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield note_schema_1.Note.remove({});
        yield user_schema_1.User.remove({});
        const seedObject = yield seedUsersAndNotes();
        notes = seedObject.notes;
    }));
    describe("GET /notes", () => {
        it("should get all notes for signed in user including shared with.", (done) => {
            // Sign in the first user. And ensure it only returns the notes
            // assigned to it.
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .get("/notes")
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(4);
                    done();
                });
            });
        });
    });
    describe("GET /notes/{id}", () => {
        it("should return a 400 if the id sent is not a valid mongo id.", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .get("/notes/blah")
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
            });
        });
        it("should return a 404 if the note is not found.", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .get("/notes/5c885d0ef35e8503bbf9fbdd")
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
        });
        it("should return a 401 if the note does not belong to the user.", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .get("/notes/" + notes[5]._id)
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
            });
        });
        it("should not return a 401 if the note is marked as public", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .get("/notes/" + notes[4]._id)
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            });
        });
        it("should get a single note", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .get("/notes/" + notes[0]._id)
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("description");
                    res.body.should.have.property("updatedAt");
                    res.body.should.have.property("createdAt");
                    res.body.should.have.property("recycled");
                    res.body.should.have.property("isPublic");
                    res.body.should.have.property("userId");
                    done();
                });
            });
        });
        it("should get a single shared note", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .get("/notes/" + notes[3]._id)
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("description");
                    res.body.should.have.property("updatedAt");
                    res.body.should.have.property("createdAt");
                    res.body.should.have.property("recycled");
                    res.body.should.have.property("isPublic");
                    res.body.should.have.property("userId");
                    done();
                });
            });
        });
    });
    describe("PUT /notes", () => {
        it("should return a 400 if the id sent is not a valid mongo id.", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .put("/notes/blah")
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
            });
        });
        it("should return a 404 if the note is not found.", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .put("/notes/5c885d0ef35e8503bbf9fbdd")
                    .set("Authorization", "Bearer " + token)
                    .send({ title: "blah" })
                    .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
        });
        it("should return a 401 if the note does not belong to the authorized user", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .put("/notes/" + notes[3]._id)
                    .set("Authorization", "Bearer " + token)
                    .send({ title: "blah" })
                    .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
            });
        });
        it("should update a note", (done) => {
            authorizeUser1((token) => {
                notes[0].description = "New Note!";
                chai_1.default
                    .request(app_1.default)
                    .put("/notes/" + notes[0]._id)
                    .set("Authorization", "Bearer " + token)
                    .send(notes[0])
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("description");
                    res.body.should.have.property("updatedAt");
                    res.body.should.have.property("createdAt");
                    res.body.should.have.property("recycled");
                    res.body.should.have.property("isPublic");
                    res.body.should.have.property("_id");
                    done();
                });
            });
        });
        it("should update a note without a description", (done) => {
            authorizeUser1((token) => {
                notes[0].description = "New Note!";
                chai_1.default
                    .request(app_1.default)
                    .put("/notes/" + notes[0]._id)
                    .set("Authorization", "Bearer " + token)
                    .send(notes[0])
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("description");
                    res.body.should.have.property("updatedAt");
                    res.body.should.have.property("createdAt");
                    res.body.should.have.property("recycled");
                    res.body.should.have.property("isPublic");
                    res.body.should.have.property("_id");
                    done();
                });
            });
        });
        it("should not update a note without a title", (done) => {
            authorizeUser1((token) => {
                notes[0].description = "";
                notes[0].title = "";
                chai_1.default
                    .request(app_1.default)
                    .put("/notes/" + notes[0]._id)
                    .set("Authorization", "Bearer " + token)
                    .send(notes[0])
                    .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("errors");
                    done();
                });
            });
        });
    });
    describe("POST /notes", () => {
        it("should create a note", (done) => {
            authorizeUser1((token) => {
                const note = {
                    description: "Second Test Note",
                    title: "Test Note!"
                };
                chai_1.default
                    .request(app_1.default)
                    .post("/notes")
                    .send(note)
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("description");
                    res.body.should.have.property("updatedAt");
                    res.body.should.have.property("createdAt");
                    res.body.should.have.property("isPublic");
                    res.body.should.have.property("recycled");
                    res.body.should.have.property("_id");
                    done();
                });
            });
        });
        it("should create a note without a description", (done) => {
            authorizeUser1((token) => {
                const note = {
                    title: "Test Title"
                };
                chai_1.default
                    .request(app_1.default)
                    .post("/notes")
                    .send(note)
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("description");
                    res.body.should.have.property("updatedAt");
                    res.body.should.have.property("createdAt");
                    res.body.should.have.property("recycled");
                    res.body.should.have.property("isPublic");
                    res.body.should.have.property("_id");
                    done();
                });
            });
        });
        it("should not create a note without a title", (done) => {
            authorizeUser1((token) => {
                const note = {
                    description: "Second Test Note"
                };
                chai_1.default
                    .request(app_1.default)
                    .post("/notes")
                    .set("Authorization", "Bearer " + token)
                    .send(note)
                    .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("errors");
                    done();
                });
            });
        });
    });
    describe("Recycle /notes", () => {
        it("should return a 400 if the id sent is not a valid mongo id.", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .post("/notes/blah/recycle")
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
            });
        });
        it("should return a 404 if the note is not found.", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .post("/notes/5c885d0ef35e8503bbf9fbdd/recycle")
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
        });
        it("should return a 401 if the note does not belong to the authorized user.", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .post("/notes/" + notes[3]._id + "/recycle")
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
            });
        });
        it("should recycle a note", (done) => {
            authorizeUser1((token) => {
                chai_1.default
                    .request(app_1.default)
                    .post("/notes/" + notes[0]._id + "/recycle")
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("recycled");
                    res.body.recycled.should.be.eql(true);
                    done();
                });
            });
        });
        describe("Restore /notes", () => {
            it("should return a 400 if the id sent is not a valid mongo id.", (done) => {
                authorizeUser1((token) => {
                    chai_1.default
                        .request(app_1.default)
                        .post("/notes/blah/restore")
                        .set("Authorization", "Bearer " + token)
                        .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
                });
            });
            it("should return a 401 if the note does not belong to the user", (done) => {
                authorizeUser1((token) => {
                    chai_1.default
                        .request(app_1.default)
                        .post("/notes/" + notes[3]._id + "/restore")
                        .set("Authorization", "Bearer " + token)
                        .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
                });
            });
            it("should return a 404 if the note is not found.", (done) => {
                authorizeUser1((token) => {
                    chai_1.default
                        .request(app_1.default)
                        .post("/notes/5c885d0ef35e8503bbf9fbdd/restore")
                        .set("Authorization", "Bearer " + token)
                        .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
                });
            });
            it("should restore a note", (done) => {
                authorizeUser1((token) => {
                    chai_1.default
                        .request(app_1.default)
                        .post("/notes/" + notes[0]._id + "/restore")
                        .set("Authorization", "Bearer " + token)
                        .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have.property("recycled");
                        res.body.recycled.should.be.eql(false);
                        done();
                    });
                });
            });
        });
    });
    // describe("Delete /notes", () => {
    //   it("should return a 400 if the id sent is not a valid mongo id.", (done) => {
    //     chai
    //       .request(app)
    //       .delete("/notes/blah")
    //       .end((err, res) => {
    //         res.should.have.status(400);
    //         done();
    //       });
    //   });
    //   it("should return a 404 if the note is not found.", (done) => {
    //     chai
    //       .request(app)
    //       .delete("/notes/5c885d0ef35e8503bbf9fbdd")
    //       .end((err, res) => {
    //         res.should.have.status(404);
    //         done();
    //       });
    //   });
    //   it("should permanently delete a note", (done) => {
    //     createNote(testUser._id, (note) => {
    //       chai
    //         .request(app)
    //         .delete("/notes/" + note._id)
    //         .end((err, res) => {
    //           res.should.have.status(200);
    //           res.body.should.be.a("object");
    //           res.body.should.have.property("recycled");
    //           res.body.recycled.should.be.eql(false);
    //           done();
    //         });
    //     });
    //   });
    // });
});
//# sourceMappingURL=notes.test.js.map