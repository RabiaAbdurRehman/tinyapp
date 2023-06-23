// requirements
const express = require("express");
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//first Routes
app.get("/", (req, res) => {
    res.send("Welcome to my Tinyapp");
});
//second Routes
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
app.get("/urls", (req, res) => {
    const templateVars = {urls: urlDatabase}
    res.render('urls_index', templateVars);
})
//To check how we put html code in res.
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello<b>World</b></body></html>\n")
});

app.listen(PORT, () => {
    console.log(`Starting with listening on PORT ${PORT}`);
});