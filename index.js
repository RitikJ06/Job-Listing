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

app.get("/health", (req, res) => {
  res.send("Everything is working fine!");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            let passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign( { email }, process.env.JWT_SECRET_KEY,
                { expiresIn: "2h" } );
                return res.send({
                    status: "SUCCESS",
                    message: "User logged in successfully",
                    jwtToken,
                });
            }
        }
        res.send({ status: "FAIL", message: "Incorrect credentials" });
    } catch (error) {
        res.send({ error });
    }
});

app.post("/register", async (req, res) => {
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
        res.send({ error });
  }
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
