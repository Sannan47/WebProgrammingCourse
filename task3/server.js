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

app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const user = new User(username, password);

    const result = await user.login();

    if (result) {
        req.session.user = username;
        res.send("Login successful");
    } else {
        res.send("Invalid username or password");
    }

});

function auth(req, res, next) {

    if (req.session.user) {
        next();
    } else {
        res.send("Please login first");
    }

}

app.get("/dashboard", auth, (req, res) => {

    res.send("Welcome " + req.session.user);

});

app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.send("Logout successful");
    });

});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
