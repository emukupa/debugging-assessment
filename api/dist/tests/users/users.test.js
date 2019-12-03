"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = "test";
const user_schema_1 = require("../../models/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const app_1 = __importDefault(require("../../app"));
const should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
const createUser = done => {
    user_schema_1.User.create({
        email: "blah@example.com",
        name: "Thomas Evans",
        passwordHash: bcrypt_1.default.hashSync("eightcharacterpassword", 10)
    }).then((user) => {
        done(user);
    });
};
const authorizeUser1 = done => {
    chai_1.default
        .request(app_1.default)
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
        user_schema_1.User.remove({}, err => {
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
            chai_1.default
                .request(app_1.default)
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
            chai_1.default
                .request(app_1.default)
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
                chai_1.default
                    .request(app_1.default)
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
                chai_1.default
                    .request(app_1.default)
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
                chai_1.default
                    .request(app_1.default)
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
//# sourceMappingURL=users.test.js.map