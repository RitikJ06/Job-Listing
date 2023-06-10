const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Job = require("./models/job");

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

const isAuthenticated = (req, res, next) => {
  try {
    const user = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY);
    req.user = user;
  } catch (error) {
    return res.send({ status: "FAIL", message: "Please login first" });
  }
  next();
};

app.get("/health", (req, res) => {
  res.send("Everything is working fine!");
});

app.get("/users", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((error) => next(error));
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      let passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
          expiresIn: "2h",
        });
        return res.send({
          status: "SUCCESS",
          message: "User logged in successfully",
          jwtToken,
        });
      }
    }
    res.send({ status: "FAIL", message: "Incorrect credentials" });
  } catch (error) {
    next(new Error("Something went wrong! Please try after some time."));
  }
});

app.post("/register", async (req, res, next) => {
  const { name, email, mobile, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        status: "FAIL",
        message: "User already exists with the provided email",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      mobile,
      password: encryptedPassword,
    });
    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });
    res.send({
      status: "SUCCESS",
      message: "User created successfully",
      jwtToken,
    });
  } catch (error) {
    next(new Error("Something went wrong! Please try after some time."));
  }
});

app.post("/api/jobs", isAuthenticated, async (req, res, next) => {
  const {
    companyName,
    position,
    monthlySalary,
    jobType,
    internshipDuration,
    workingMode,
    jobDescription,
    aboutCompany,
    skills,
    logo,
    location,
  } = req.body;
  try {
    if 
      ((!companyName ||
        !position ||
        !monthlySalary ||
        !jobType ||
        !workingMode ||
        !jobDescription ||
        !aboutCompany ||
        !skills) || (workingMode == "office" && !location) ||
      (jobType == "internship" && !internshipDuration)
    ) {
      const err = new Error("All required fileds are not provided!");
      err.status = 403;
      next(err);
    }

    await Job.create({
      companyName,
      position,
      monthlySalary: +monthlySalary,
      jobType,
      internshipDuration,
      workingMode,
      jobDescription,
      aboutCompany,
      skills: skills.split(","),
      logo,
      location
    });

    return res.json({ staus: "success", message: "Job added successfully" });
  } catch {
    const err = new Error("Error creating new job");
    err.status = 500;
    next(err);
  }
});

app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("connection failed", err));
});
