const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require('cors');

const User = require("./models/user");
const Job = require("./models/job");

dotenv.config();

const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static("./public"));

const isAuthenticated = (req, res, next) => {
  try {
    const user = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY);
    req.user = user;
  } catch (error) {
    return res.send({ status: 401, message: "Please login first" });
  }
  next();
};

app.get('/authenticate', isAuthenticated, (req, res) => {
  res.send({status: 202, message: 'user authenticated'})
})

app.get("/health", (req, res) => {
  res.send("Everything is working fine!");
});

// api to login a user
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
          status: 200,
          message: "User logged in successfully",
          name: user.name,
          jwtToken,
        });
      }
    }
    res.send({ status: 401, message: "Incorrect credentials" });
  } catch (error) {
    next(new Error("Something went wrong! Please try after some time."));
  }
});

// api to register a new user
app.post("/register", async (req, res, next) => {
  const { name, email, mobile, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        status: 403,
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
      status: 200,
      message: "User created successfully",
      name,
      jwtToken,
    });
  } catch (error) {
    next(new Error("Something went wrong! Please try after some time."));
  }
});

// api to create new job
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
    noOfEmployees,
    logo,
    location,
  } = req.body;
  try {
    if (
      !companyName ||
      !position ||
      !monthlySalary ||
      !jobType ||
      !workingMode ||
      !jobDescription ||
      !aboutCompany ||
      !noOfEmployees ||
      !skills ||
      (workingMode == "office" && !location) ||
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
      skills: skills.split(",").map((s) => s.trim()),
      noOfEmployees,
      logo,
      location
    });

    return res.json({ staus: 201, message: "Job added successfully" });
  } catch {
    const err = new Error("Error creating new job");
    err.status = 500;
    next(err);
  }
});

// api to get all jobs or with filter
app.get("/api/jobs", async (req, res, next) => {
  try {
    const { filterBySkills } = req.body;
    let jobs;
    if (filterBySkills) {
      jobs = await Job.find({
        skills: { $in: filterBySkills.split(",").map((s) => s.trim()) },
      });
    } else {
      jobs = await Job.find();
    }

    res.json(
      jobs.map((job) => {
        return {
          position: job.position,
          noOfEmployees: job.noOfEmployees,
          monthlySalary: job.monthlySalary,
          location: job.location,
          jobType: job.jobType,
          workingMode: job.workingMode,
          logo: job.logo,
          skills: job.skills,
          _id: job._id
        };
      })
    );
  } catch {
    const err = new Error("Error Fetching jobs");
    err.status = 500;
    next(err);
  }
});

// api to get detailed description of a job
app.get("/api/jobs/:id", async (req, res, next) => {
  try {
    const jobID = req.params;
    const job = await Job.findById(jobID.id);
    res.json(job);
  } catch {
    const err = new Error("Error Fetching the job");
    err.status = 500;
    next(err);
  }
});

// api to edit a job post
app.put("/api/jobs/:id", isAuthenticated, async (req, res, next) => {
  const {id} = req.params;
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
    noOfEmployees,
    logo,
    location,
  } = req.body;
  try {
    if (
      !companyName ||
      !position ||
      !monthlySalary ||
      !jobType ||
      !workingMode ||
      !jobDescription ||
      !aboutCompany ||
      !noOfEmployees ||
      !skills ||
      (workingMode == "office" && !location) ||
      (jobType == "internship" && !internshipDuration)
    ) {
      const err = new Error("All required fileds are not provided!");
      err.status = 403;
      next(err);
    }
    console.log({companyName,
      position,
      monthlySalary: +monthlySalary,
      jobType,
      internshipDuration,
      workingMode,
      jobDescription,
      aboutCompany,
      skills: skills.split(",").map((s) => s.trim()),
      noOfEmployees,
      logo,
      location})
      
    await Job.findByIdAndUpdate(id, {
      companyName,
      position,
      monthlySalary: +monthlySalary,
      jobType,
      internshipDuration,
      workingMode,
      jobDescription,
      aboutCompany,
      skills: skills.split(",").map((s) => s.trim()),
      noOfEmployees,
      logo,
      location
    })

    return res.json({ staus: 200, message: "Job updated successfully"});
  } catch {
    const err = new Error("Error updating the job");
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
