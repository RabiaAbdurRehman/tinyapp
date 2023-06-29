// requirements
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080;
//middle ware, everyime you recieve a request. they will be executed.
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));// = req.body, for submitting forms.

//our tempoarary database for now.
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};
const users = {
    userRandomID: {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur",
    },
    user2RandomID: {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk",
    },
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
// checking duplicate emails
function getUserByEmail(email) {
    for (const userId in users) {
        if (users[userId].email === email) {
            return users[userId];// return false
        }
    }
    return null;//return true;
}
//cehcking passwords if they match:
function getPasswordByEmail(users, password) {
    for (const userId in users) {

        if (users[userId].password === password)
            return true;

    }
    return false;
};
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
    const user = users[req.cookies['user_id']];
    const templateVars = { urls: urlDatabase, user: user };
    res.render('urls_index', templateVars);
});
// to enter new info though form
app.get("/urls/new", (req, res) => {
    const user = users[req.cookies['user_id']];
    const templateVars = { user: user };
    res.render("urls_new", templateVars);
});
//show a data to a specific id.
app.get("/urls/:id", (req, res) => {
    const user = users[req.cookies['user_id']];
    console.log(user);
    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: user };
    res.render("urls_show", templateVars);

});
app.get("/register", (req, res) => {
    res.render('registration.ejs');
});
app.get("/login", (req, res) => {
    res.render('login.ejs');

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
    res.redirect(`/urls`);
});
app.post("/login", (req, res) => {
    //console.log("login in called")
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(401).send("Email or password can not be empty!");
        return;
    }
    const user = getUserByEmail(email);
    if (!user) {
        return res.status(401).send("Email can not be found!");
    }
    if (!getPasswordByEmail(users, password)) {

        return res.status(401).send("Password doesnt match");
    }
    res.cookie("user_id", user.id);
    res.redirect("/urls");
});
app.post("/Logout", (req, res) => {
    //console.log('Logout button clicked');
    res.clearCookie('user_id');
    res.redirect('/login');
});
app.post("/register", (req, res) => {
    const newUser = {};
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(401).send("Email or password can not be empty!");
        return;
    }
    if (getUserByEmail(email)) {
        return res.status(401).send("Email already exists!");
    };
    const userId = generateRandomString();
    users[userId] = {
        id: userId,
        email: email,
        password: password
    };
    res.cookie("user_id", userId);
    res.redirect("/urls");
});
//To check how we put html code in res.
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.listen(PORT, () => {
    console.log(`Starting with listening on PORT ${PORT}`);
});