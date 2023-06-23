// requirements
const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));// for submitting forms.
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let resultNumber = '';
    for (let i = 0; i < 6; i++) {
        resultNumber += chars[Math.floor(Math.random() * chars.length)];
    }
    return resultNumber;
}
//first Routes
app.get("/", (req, res) => {
    res.send("Welcome to my Tinyapp");
});
//second Routes
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
//show our data
app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render('urls_index', templateVars);
});
// to enter new though form
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});
//show a data to a specific id.
app.get("/urls/:id", (req, res) => {

    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
    res.render("urls_show", templateVars);

});

app.post("/urls", (req, res) => {
    console.log(req.body); // Log the POST request body to the console for us to see
    const shortUrl = generateRandomString();// get unique id by calling function.
    urlDatabase[id] = req.body.longURL; // save longURL from submissions and generate id, store in urlDatabase
    console.log(urlDatabase); //for us to see.
    res.redirect(`/urls/${id}`); // Redirects to new page for longURL and shortURL
});

//To check how we put html code in res.
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.listen(PORT, () => {
    console.log(`Starting with listening on PORT ${PORT}`);
});