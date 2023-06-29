// requirements
const express = require("express");
const app = express();
//const cookieParser = require('cookie-parser');
const PORT = 8080;
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
//middle ware, everyime you recieve a request. they will be executed.
app.set("view engine", "ejs");
app.use(cookieSession({
    name: 'session',
    keys: ["abc"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
//app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));// = req.body, for submitting forms.

//our tempoarary database for now.
const urlDatabase = {
    b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userId: "aJ48lW",
    },
    b6MTxy: {
        longURL: "http://www.lighthouselabs.ca",
        userId: "at49lw",
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userId: "aJ48lW",
    }
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
function urlsForUser(user) {
    const userUrls = {};
    for (const id in urlDatabase) {
        if (urlDatabase[id].userId === user.id) {
            userUrls[id] = urlDatabase[id];
        }

    }
    return userUrls;
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
    const user = users[req.session['user_id']];
    if (!user) {
        res.status(401).send(`you must be login`);
        return; //res.redirect(`/login`);
    }
    else {
        urlsForUser(user);
        const templateVars = { urls: urlDatabase, user: user };
        return res.render('urls_index', templateVars);

    }


});
// to enter new info though form
app.get("/urls/new", (req, res) => {
    const user = users[req.session['user_id']];
    const templateVars = { user: user };
    if (!user) {
        res.redirect(`/login`);
        return;
    }
    res.render("urls_new", templateVars);

});
//show a data to a specific id.
app.get("/urls/:id", (req, res) => {

    const user = users[req.session['user_id']];
    if (!user) {
        res.status(401).send(`you must be login`);
        return;
    }
    const shortURL = req.params.id;
    if (!urlDatabase[shortURL]) {
        res.status(404).send(`shortURL doesnt exist`);
        return;
    }
    const templateVars = { id: req.params.id, longURL: urlDatabase[shortURL].longURL, user: user };
    console.log(urlDatabase[shortURL], user.id);
    if (urlDatabase[shortURL].userId !== user.id) {
        res.status(401).send(`you are not authentic to access this page.`);
        return;
    }
    else {
        res.render("urls_show", templateVars);
    }

    //res.redirect(`/login`);//check

});
app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id].longURL; //urlDatabase[id].longUrl.)
    if (!longURL) {
        res.send("sorry URL doesnt exist.");
        return;
    }
    res.redirect(longURL);
});
app.get("/register", (req, res) => {
    //res.render('registration.ejs');
    if (req.session['user_id']) {
        res.redirect(`/urls`);
        return;
    }
    res.render('registration.ejs');

});
app.get("/login", (req, res) => {

    if (req.session['user_id']) {
        res.redirect(`/urls`);

    } else {
        res.render('login.ejs');
    }

});
app.post("/urls", (req, res) => {
    const user = users[req.session['user_id']];
    if (!user) {
        res.send("sorry you are not logged in.");
        return;
    }
    //console.log(req.body); // Log the POST request body to the console for us to see
    const shortUrl = generateRandomString();// get unique id by calling function.

    urlDatabase[shortUrl] = {
        longURL: req.body.longURL,
        userId: user.id
    }; // save longURL from submissions and generate id, store in urlDatabase
    //console.log(urlDatabase); //for us to see.
    res.redirect(`/urls/${shortUrl}`);// Redirects to new page for longURL and shortURL
});
// Route for /urls/:id to handle editing of Short URL ID details
app.post(`/urls/:id`, (req, res) => {
    // Get the id from the route parameter
    const id = req.params.id;

    //should return a relevant error message if id does not exist
    if (!urlDatabase[id]) {
        res.status(404).send(`id doesnt exist`);
        return;
    }
    //sould return a relevant error message if the user is not logged in
    const user = users[req.session['user_id']];
    if (!user) {
        res.status(404).send("sorry you are not logged in.");
        return;
    }
    //console.log(urlDatabase[id]);
    // console.log(user);
    //should return a relevant error message if the user does not own the URL
    if (urlDatabase[id].userId !== user.id) { // curl -X POST --cookie "user_id=userRandomID" localhost:8080/urls/i3BoGr

        res.status(404).send(`The user doesnt own this url.`);
        return;

    }


    // Assign longURL value to be the editURL value received from the POST request body
    const newLongURL = req.body.longURL;
    // Update the longUrl value in the database with the new value
    urlDatabase[id].longURL = newLongURL;
    // Redirect user to /urls
    res.redirect(`/urls`);
});
app.post("/urls/:id/delete", (req, res) => {
    const ids = req.params.id;
    const user = users[req.session['user_id']];
    if (!urlDatabase[ids]) {
        res.status(404).send(`id doesnt exist`);
        return;
    }
    if (!user) {
        res.status(404).send("sorry you are not logged in.");
        return;
    }
    if (urlDatabase[ids].userId !== user.id) { // curl -X POST --cookie "user_id=userRandomID" localhost:8080/urls/i3BoGr/delete
        res.status(404).send(`The user doesnt own this url so you cant delete it.`);
        return;
    }
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
    //const isMatch = password === user.password;
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).send('authentication failed!');
    }
    // res.cookie("user_id", user.id);
    req.session.user_id = user.id;
    res.redirect("/urls");
});
app.post("/Logout", (req, res) => {
    //console.log('Logout button clicked');
    // res.clearCookie('user_id');
    req.session = null;
    res.redirect('/login');
});
app.post("/register", (req, res) => {
    const newUser = {};
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(401).send("Email or password can not be empty!");
    }
    if (getUserByEmail(email)) {
        return res.status(401).send("Email already exists!");
    };
    //bcrypt process
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = generateRandomString();
    users[userId] = {
        id: userId,
        email: email,
        password: hashedPassword
    };
    //console.log(hashedPassword);
    //res.cookie("user_id", userId);
    req.session.user_id = userId;
    res.redirect("/urls");
});
//To check how we put html code in res.
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.listen(PORT, () => {
    console.log(`Starting with listening on PORT ${PORT}`);
});