const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");



//to short url
const generateRandomString = () => {
  let output = Math.random().toString(36).replace(/[^a-z+0-9]+/g, '').substr(0, 6);
  return output;
};




//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//config
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//sending deta to urls_index.ejs , http://localhost:8080/urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});




//sending deta to hello_world.ejs , http://localhost:8080/hello
app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});




//render urls_new.ejs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


//get data from the form in body and translate it
app.post("/urls", (req, res) => {
  console.log(req.body);

  const longUrl = req.body.longURL; // Log the POST request body to the console
  const shortUrl = generateRandomString();

  urlDatabase[shortUrl] = longUrl;
  res.redirect(`/urls/${shortUrl}`);
  //res.redirect('/urls');
  //res.send("ok"); // Respond with 'Ok' (we will replace this)
});



//sending data to urls_show.ejs
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


//shortener /urls/:id
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


//delete url
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


//edit url
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  console.log(shortURL);
  console.log(req.body.longURL);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});




//http://localhost:8080/
app.get("/", (req, res) => {
  res.send("Hello!");
});


//http://localhost:8080/urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//http://localhost:8080/hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});




//register
app.get("/register", (req, res) => {
  /* const templateVars = {
    shortURL: req.params.id,
    longUrl: urlDatabase[req.params.id],
    username: req.cookies["username"]
  }; */
  res.render("register");
});






app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





