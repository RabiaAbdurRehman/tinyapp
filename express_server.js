// requirements
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080;

app.set("view engine", "ejs");
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));// for submitting forms.
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};
//To create unique Id
function generateRandomString() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let resultNumber = '';
    for (let i = 0; i < 6; i++) {
        resultNumber += chars[Math.floor(Math.random() * chars.length)];
    }
    return resultNumber;
}
//first Routes
//first very home page
app.get("/", (req, res) => {
    res.send("Welcome to my Tinyapp");
});
//second Routes
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
//show our data
app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
    res.render('urls_index', templateVars);
});
// to enter new info though form
app.get("/urls/new", (req, res) => {
    const templateVars = {username: req.cookies["username"] }
    res.render("urls_new", templateVars);
});
//show a data to a specific id.
app.get("/urls/:id", (req, res) => {

    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
    res.render("urls_show", templateVars);

});

app.post("/urls", (req, res) => {
    console.log(req.body); // Log the POST request body to the console for us to see
    const shortUrl = generateRandomString();// get unique id by calling function.
    urlDatabase[shortUrl] = req.body.longURL; // save longURL from submissions and generate id, store in urlDatabase
    console.log(urlDatabase); //for us to see.
    res.redirect(`/urls/${shortUrl}`); // Redirects to new page for longURL and shortURL
});
// Route for /urls/:id to handle editing of Short URL ID details
app.post(`/urls/:id`, (req, res) => {
    // Get the id from the route parameter
    const id = req.params.id;
    // Assign longURL value to be the editURL value received from the POST request body
    const newLongURL = req.body.longURL;
    // Update the longUrl value in the database with the new value
    urlDatabase[id] = newLongURL;
    // Redirect user to /urls
    res.redirect(`/urls`);
});
app.post("/urls/:id/delete", (req, res) => {
    const ids = req.params.id;
    for (let keys in urlDatabase) {
        if (keys === ids) {
            delete urlDatabase[keys];
        }
    }
    //     const requestID = req.params.id;

    //     if (urlDatabase[requestID]) {
    //     delete urlDatabase[requestID]
    // }
    res.redirect(`/urls`);
});
app.post("/login", (req, res) => {
    const userName = req.body.userName;
    res.cookie('username', userName);
    res.redirect('/urls');
});
//To check how we put html code in res.
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.listen(PORT, () => {
    console.log(`Starting with listening on PORT ${PORT}`);
});