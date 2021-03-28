const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

module.exports = function (app) {
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
  app.get("/getUser", (req, res, next) => {
    let token = req.headers.authorization;
    console.log("token: " + token);
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, user) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.user = user;
      console.log(user);
      return res.status(200).send(user);
    });
  });
};
