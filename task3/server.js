const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./User");

mongoose.connect("mongodb://localhost:27017/studentDB")
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log(err);
});

const app = express();

app.use(express.json());

app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true
}));


app.post("/register", async (req, res) => {

    console.log(req.body);

    const { username, password } = req.body;

    const user = new User(username, password);

    const result = await user.register();

    res.send(result);
});
