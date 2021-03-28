const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

module.exports = async function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/register",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.register
  );

  app.post("/login", controller.login);
  app.get("/getUser", async function (req, res, next) {
    let bearerheader = req.headers.authorization;
    console.log("token: " + bearerheader);
    const bearer = bearerheader.split(" ");
    const bearertoken = bearer[1];
    if (!bearertoken) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(bearertoken, config.secret, async function (err, user) {
      if (err) {
        console.log(err);
        console.log(user);
        return res.status(401).send({ message: "Unauthorized!" });
      }
      const query = await User.findOne({
        id: user.id,
      })
        .populate("roles", "-__v")
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
          for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
          }
          // req.user = query;
          console.log("query: " + JSON.stringify(query));
          console.log("req.user: " + JSON.stringify(req.user));
          // return res.status(200).send(query);
          return res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
          });
        });
    });
  });
};
