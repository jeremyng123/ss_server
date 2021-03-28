const express = require("express");
const cors = require("cors");

const app = express();

// var corsOptions = { origin: "http://localhost:3000" };

// app.use(cors(corsOptions));
app.use(cors());

const db = require("../models");
const dbConfig = require("../config/db.config");
const Role = db.role;

db.mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@${dbConfig.HOST}`,
    // `mongodb://localhost:27017/ss_project`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to System Security Project API homepage" });
});

// routes
require("../routes/auth.routes")(app);
require("../routes/user.routes")(app);

//set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
