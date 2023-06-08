const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require('./models/user');
const Job = require('./models/job');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.get('/health', (req, res) => {
    res.send("Everything is working fine!")
})

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("connection failed", err));
});
