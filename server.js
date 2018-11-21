const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { MongoClient, ObjectID } = require("mongodb");

let db;

function initialise() {
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static("public"));
}

function renderLink(res) {
  db.collection("links")
    .find({ isUsed: false })
    .toArray((err, result) => {
      if (err) return console.log(err);
      // renders index.ejs
      res.render("index.ejs", { link: result[0] });
    });
}

MongoClient.connect(
  "mongodb://luptilu:luisa1@ds143293.mlab.com:43293/audiodatenbank",
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("audiodatenbank"); // whatever your database name is
    app.listen(3000, () => {
      console.log("listengdgdgding on 3000");
    });
  }
);

initialise();

app.get("/", (req, res) => {
  renderLink(res);
});

app.post("/links", (req, res) => {
  let data = req.body;
  db.collection("links").update(
    { _id: ObjectID(data._id) },
    {
      $set: {
        isUsed: true,
        feedback: data.feedback
      }
    },
    () => {
      renderLink(res);
    }
  );
});
