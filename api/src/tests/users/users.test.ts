process.env.NODE_ENV = "test";

import { IUserModel, User } from "../../models/user.schema";

import bcrypt from "bcrypt";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
const should = chai.should();

chai.use(chaiHttp);

const createUser = done => {
  User.create({
    email: "blah@example.com",
    name: "Thomas Evans",
    passwordHash: bcrypt.hashSync("eightcharacterpassword", 10)
  }).then((user: IUserModel) => {
    done(user);
  });
};

const authorizeUser1 = done => {
  chai
    .request(app)
    .post("/users/signin")
    .send({
      email: "blah@example.com",
      password: "eightcharacterpassword"
    })
    .end((err, res) => {
      res.should.have.status(200);
      done(res.body.token);
    });
};

describe("Users", () => {
  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  describe("POST /users/register", () => {
    it("should create a user", done => {
      const user = {
        email: "blah@example.com",
        name: "Thomas Evans",
        password: "testpassword"
      };

      chai
        .request(app)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.should.have.property("email");
          res.body.should.not.have.property("passwordHash");
          res.body.should.have.property("_id");
          done();
        });
    });

    it("should not create a user without an email", done => {
      const user = {
        name: "Thomas Evans",
        password: "testpassword"
      };

      chai
        .request(app)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          done();
        });
    });
  });

  describe("Authenticating", () => {
    it("should authenticate a user properly", done => {
      createUser(user => {
        const req = {
          email: user.email,
          password: "eightcharacterpassword"
        };

        chai
          .request(app)
          .post("/users/signin")
          .send(req)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it("should create a JWT properly on successful authentication", done => {
      createUser(user => {
        const req = {
          email: user.email,
          password: "eightcharacterpassword"
        };

        chai
          .request(app)
          .post("/users/signin")
          .send(req)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("token");
            done();
          });
      });
    });

    it("should return a 401 if the password is incorrect.", done => {
      createUser(user => {
        const req = {
          email: user.email,
          password: "other password"
        };

        chai
          .request(app)
          .post("/users/signin")
          .send(req)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
  });
});
