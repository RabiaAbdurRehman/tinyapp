/**
 * requirements
 *
 */
const express = require("express");
const app = express();
//const cookieParser = require('cookie-parser');
const PORT = 8080;
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
/**
 * Module exports.
 *
 */
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("./helpers");
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////////////////////////////////////////////////////

// set up middleware
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["abc"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
//app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // = req.body, for submitting forms.
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Database
/////////////////////////////////////////////////////////////////////////////////////////////////////
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
  },
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
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////////////////////////////////////////////////

// GET /homePage
app.get("/", (req, res) => {
  const user = users[req.session["user_id"]];
  if (!user) {
    res.status(401).send(`you must be login`);
    return res.redirect("/login");
  }
  res.redirect("/urls");
});
//show our data
// GET /urls
app.get("/urls", (req, res) => {
  const user = users[req.session["user_id"]];
  if (!user) {
    res.status(401).send(`you must be login`);
    return res.redirect("/login");
  } else {
    const userUrls = urlsForUser(user, urlDatabase);
    const templateVars = { urls: userUrls, user: user };
    return res.render("urls_index", templateVars);
  }
});
// GET /urls/new
// to enter new info though form
app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]];
  const templateVars = { user: user };
  if (!user) {
    res.redirect(`/login`);
    return;
  }
  res.render("urls_new", templateVars);
});
// GET /urls/:id
//show a data to a specific id.
app.get("/urls/:id", (req, res) => {
  const user = users[req.session["user_id"]];
  if (!user) {
    res.status(401).send(`you must be login`);
    return;
  }
  const shortURL = req.params.id;
  if (!urlDatabase[shortURL]) {
    res.status(404).send(`shortURL doesnt exist`);
    return;
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[shortURL].longURL,
    user: user,
  };
  console.log(urlDatabase[shortURL], user.id);
  if (urlDatabase[shortURL].userId !== user.id) {
    res.status(401).send(`you are not authentic to access this page.`);
    return;
  } else {
    res.render("urls_show", templateVars);
  }
});
// GET /u/:id
app.get("/u/:id", (req, res) => {
  console.log("ID:", req.params.id);
  console.log("urlDatabase:", urlDatabase);
  const longURL = urlDatabase[req.params.id].longURL; //urlDatabase[id].longUrl.)
  console.log("urlong", longURL);
  if (!longURL) {
    res.send("sorry URL doesnt exist.");
    return;
  }
  res.redirect(longURL);
});
// GET /register
app.get("/register", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect(`/urls`);
    return;
  }
  res.render("registration.ejs");
});
// GET /login
app.get("/login", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect(`/urls`);
  } else {
    res.render("login.ejs");
  }
});
// POST /urls
app.post("/urls", (req, res) => {
  const user = users[req.session["user_id"]];
  if (!user) {
    res.send("sorry you are not logged in.");
    return;
  }
  //console.log(req.body); // Log the POST request body to the console for us to see
  const shortUrl = generateRandomString(); // get unique id by calling function.

  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    userId: user.id,
  }; // save longURL from submissions and generate id, store in urlDatabase
  //console.log(urlDatabase); //for us to see.
  res.redirect(`/urls/${shortUrl}`); // Redirects to new page for longURL and shortURL
});
// Route for /urls/:id to handle editing of Short URL ID details
// POST /urls/:id
app.post(`/urls/:id`, (req, res) => {
  // Get the id from the route parameter
  const id = req.params.id;

  //should return a relevant error message if id does not exist
  if (!urlDatabase[id]) {
    res.status(404).send(`id doesnt exist`);
    return;
  }
  //sould return a relevant error message if the user is not logged in
  const user = users[req.session["user_id"]];
  if (!user) {
    res.status(404).send("sorry you are not logged in.");
    return;
  }
  //should return a relevant error message if the user does not own the URL
  if (urlDatabase[id].userId !== user.id) {
    // curl -X POST --cookie "user_id=userRandomID" localhost:8080/urls/i3BoGr

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
// POST /urls/:id/delete
app.post("/urls/:id/delete", (req, res) => {
  const ids = req.params.id;
  const user = users[req.session["user_id"]];
  if (!urlDatabase[ids]) {
    res.status(404).send(`id doesnt exist`);
    return;
  }
  if (!user) {
    res.status(404).send("sorry you are not logged in.");
    return;
  }
  if (urlDatabase[ids].userId !== user.id) {
    // curl -X POST --cookie "user_id=userRandomID" localhost:8080/urls/i3BoGr/delete
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
// POST /login
app.post("/login", (req, res) => {
  //console.log("login in called")
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(401).send("Email or password can not be empty!");
    return;
  }
  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(401).send("Email can not be found!");
  }
  //const isMatch = password === user.password;
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(403).send("authentication failed!");
  }
  // res.cookie("user_id", user.id);
  req.session.user_id = user.id;
  res.redirect("/urls");
});
// POST /logout
app.post("/Logout", (req, res) => {
  // res.clearCookie('user_id');
  req.session = null;
  res.redirect("/login");
});
// POST /register
app.post("/register", (req, res) => {
  const newUser = {};
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(401).send("Email or password can not be empty!");
  }
  if (getUserByEmail(email, users)) {
    return res.status(401).send("Email already exists!");
  }
  //bcrypt process
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: email,
    password: hashedPassword,
  };
  //res.cookie("user_id", userId);
  req.session.user_id = userId;
  res.redirect("/urls");
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Listener
/////////////////////////////////////////////////////////////////////////////////////////////////////

// start the server up

app.listen(PORT, () => {
  console.log(`Starting with listening on PORT ${PORT}`);
});
