const express = require("express");
const app = express();
const PORT = 8080;

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
    res.send("Welcome to my Tinyapp");
});

app.listen(PORT, () => {
    console.log(`Starting with listening on PORT ${PORT}`);
});