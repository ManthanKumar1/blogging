const express = require("express");
const mongodb = require("mongodb");

const app = express();
app.use(express.json());

const connectionUrl = "mongodb://localhost:27017";

const client = new mongodb.MongoClient(connectionUrl);
client
  .connect()
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.log(error));

const db = client.db("schoolDb");
const student = db.collection("student");

// add student
app.post("/student", (req, res, next) => {
  student
    .insertMany(req.body)
    .then(() => res.status(201).send("Student added successfully"))
    .catch((error) => res.status(500).send(error.message));
});

// get student
app.get("/student", (req, res, next) => {
  const { dept } = req.query;

  student
    .find({ dept: dept })
    .toArray()
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).send(error.message));
});

// update student
app.put("/student", (req, res, next) => {
  const { age } = req.query;
  const { dept } = req.body;
  student
    .updateMany({ age: parseInt(age) }, { $set: { dept } })
    .then((data) => {
      console.log(data);
      res.status(200).json({
        message: "Student updated successfully",
      });
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

// delete student
app.delete("/student", (req, res, next) => {
  const { email } = req.query;
  student
    .findOneAndDelete({ email: email })
    .then(() =>
      res.status(200).json({ message: "Student deleted successfully" })
    )
    .catch((error) => res.status(500).json({ message: error.message }));
});

const errorMiddleware = (error, req, res, next) => {
  res.status(500).send(error.message);
};

app.use(errorMiddleware);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
