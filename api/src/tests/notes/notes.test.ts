process.env.NODE_ENV = "test";

import { INoteModel, Note } from "../../models/note.schema";
import { User } from "../../models/user.schema";

import bcrypt from "bcrypt";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
const should = chai.should();

chai.use(chaiHttp);

const authorizeUser1 = (done) => {
  chai
    .request(app)
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

const seedUsersAndNotes = async () => {
  const users = [
    new User({
      email: "example@example.com",
      name: "Thomas Evans",
      passwordHash: bcrypt.hashSync("eightcharacterpassword", 10)
    }),
    new User({
      email: "blarg@example.com",
      name: "James Avery",
      passwordHash: bcrypt.hashSync("eightcharacterpassword", 10)
    })
  ];

  const UserRequests = users.map((user) => {
    return User.create(user);
  });

  await Promise.all(UserRequests);

  const notes = [
    new Note({
      description: "Belongs to User 1",
      title: "Test Note User 1",
      userId: users[0]._id
    }),
    new Note({
      description: "Belongs to User 1",
      title: "Test Note 2 User 1",
      userId: users[0]._id
    }),
    new Note({
      description: "Belongs to User 1",
      isPublic: true,
      title: "Test Note 3 User 1",
      userId: users[0]._id
    }),
    new Note({
      description: "Belongs to User 2",
      sharedWith: [users[0]._id],
      title: "Test Note User 2",
      userId: users[1]._id
    }),
    new Note({
      description: "Belongs to User 2",
      isPublic: true,
      title: "Test Public Note User 2",
      userId: users[1]._id
    }),
    new Note({
      description: "Belongs to User 2",
       title: "Test Non shared Non Public Note User 2",
      userId: users[1]._id
    })
  ];

  const allNoteRequests = notes.map((note) => {
    return Note.create(note);
  });

  await Promise.all(allNoteRequests);
  return Promise.resolve({ users, notes });
};

describe("Notes", () => {
  // List of Notes
  let notes;

  beforeEach(async () => {
    await Note.remove({});
    await User.remove({});
    const seedObject = await seedUsersAndNotes();
    notes = seedObject.notes;
  });

  describe("GET /notes", () => {
    it("should get all notes for signed in user including shared with.", (done) => {
      // Sign in the first user. And ensure it only returns the notes
      // assigned to it.
      authorizeUser1((token: string) => {
        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        chai
          .request(app)
          .get("/notes/blah")
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it("should return a 404 if the note is not found.", (done) => {
      authorizeUser1((token: string) => {
        chai
          .request(app)
          .get("/notes/5c885d0ef35e8503bbf9fbdd")
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    it("should return a 401 if the note does not belong to the user.", (done) => {
      authorizeUser1((token: string) => {
        chai
          .request(app)
          .get("/notes/" + notes[5]._id)
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    it("should not return a 401 if the note is marked as public", (done) => {
      authorizeUser1((token: string) => {
        chai
          .request(app)
          .get("/notes/" + notes[4]._id)
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it("should get a single note", (done) => {
      authorizeUser1((token: string) => {
        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        chai
          .request(app)
          .put("/notes/blah")
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it("should return a 404 if the note is not found.", (done) => {
      authorizeUser1((token: string) => {
        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        notes[0].description = "New Note!";

        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        notes[0].description = "New Note!";

        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        notes[0].description = "";
        notes[0].title = "";

        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        const note = {
          description: "Second Test Note",
          title: "Test Note!"
        };

        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        const note = {
          title: "Test Title"
        };

        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        const note = {
          description: "Second Test Note"
        };

        chai
          .request(app)
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
      authorizeUser1((token: string) => {
        chai
          .request(app)
          .post("/notes/blah/recycle")
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it("should return a 404 if the note is not found.", (done) => {
      authorizeUser1((token: string) => {
        chai
          .request(app)
          .post("/notes/5c885d0ef35e8503bbf9fbdd/recycle")
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    it("should return a 401 if the note does not belong to the authorized user.", (done) => {
      authorizeUser1((token: string) => {
        chai
          .request(app)
          .post("/notes/" + notes[3]._id + "/recycle")
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    it("should recycle a note", (done) => {
      authorizeUser1((token: string) => {
        chai
          .request(app)
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
        authorizeUser1((token: string) => {
          chai
            .request(app)
            .post("/notes/blah/restore")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
              res.should.have.status(400);
              done();
            });
        });
      });

      it("should return a 401 if the note does not belong to the user", (done) => {
        authorizeUser1((token: string) => {
          chai
            .request(app)
            .post("/notes/" + notes[3]._id + "/restore")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
              res.should.have.status(401);
              done();
            });
        });
      });

      it("should return a 404 if the note is not found.", (done) => {
        authorizeUser1((token: string) => {
          chai
            .request(app)
            .post("/notes/5c885d0ef35e8503bbf9fbdd/restore")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
        });
      });

      it("should restore a note", (done) => {
        authorizeUser1((token: string) => {
          chai
            .request(app)
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
