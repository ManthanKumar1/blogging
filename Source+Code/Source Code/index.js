const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const connectionUrl = "mongodb://localhost:27017/schoolDb";

mongoose
  .connect(connectionUrl)
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.log(error));

const studentSchema = mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  dept: String,
});

const Student = mongoose.model("student", studentSchema);

// add student
app.post("/student/single", async (req, res, next) => {
  try {
    const { name, email, age, dept, address } = req.body;

    const newStudent = new Student({
      name,
      email,
      age,
      dept,
      address,
    });
    await newStudent.save();

    res.status(200).json({ message: "Student added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/student/multiple", async (req, res, next) => {
  try {
    await Student.insertMany(req.body);

    res.status(200).json({ message: "Students added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update student
app.put("/student/single", async (req, res, next) => {
  try {
    const { email } = req.query;
    const { dept } = req.body;
    await Student.findOneAndUpdate({ email }, { dept });

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/student/single/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dept } = req.body;

    // const student = await Student.findById(id);
    const student = await Student.findOne({ _id: id });
    student.dept = dept;

    await student.save();

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/student/multiple", async (req, res, next) => {
  try {
    const { dept } = req.query;
    const { age } = req.body;
    await Student.updateMany({ dept }, { age });

    res.status(200).json({ message: "Students updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get student
app.get("/student/single", async (req, res, next) => {
  try {
    const { email } = req.query;
    const student = await Student.findOne({ email });

    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/student/single/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/student/multiple", async (req, res, next) => {
  try {
    const { dept } = req.query;
    const students = await Student.find({});

    res.status(200).json({ data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete student
app.delete("/student/single", async (req, res, next) => {
  try {
    const { email } = req.query;
    await Student.findOneAndDelete({ email });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/student/single/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/student/multiple", async (req, res, next) => {
  try {
    const { dept } = req.query;
    await Student.deleteMany({ dept });

    res.status(200).json({ message: "Students deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const errorMiddleware = (error, req, res, next) => {
  res.status(500).send(error.message);
};

app.use(errorMiddleware);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
