const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");



//middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//config
app.set("view engine", "ejs");


//to short url
const generateRandomString = () => {
  let output = Math.random().toString(36).replace(/[^a-z+0-9]+/g, '').substr(0, 6);
  return output;
};

const getUserByEmail = (email) => {
  for (let user_id in users) {
    if (users[user_id].email === email) {
      return users[user_id];
    }
  }
};

function urlsForUser(user_id) {
  var userURLS = {};
  for (let key in urlDatabase)
    if (urlDatabase[key].user_id === user_id) {
      userURLS[key] = urlDatabase[key];
    }
  return userURLS;
};




const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};



//sending deta to urls_index.ejs , http://localhost:8080/urls
app.get("/urls", (req, res) => {
  /* const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
    user: users
  }; */
  let user_id = req.cookies.id;
  let userObject = users[user_id];
  const templateVars = { urls: urlDatabase, userObject };
  res.render("urls_index", templateVars);
});






//render urls_new.ejs
app.get("/urls/new", (req, res) => {
  /* const templateVars = {
    username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  }; */
  let user_id = req.cookies.id;
  let userObject = users[user_id];
  const templateVars = { urls: urlDatabase, userObject };
  res.render("urls_new", templateVars);
});



//get data from the form in body and translate it
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  console.log(req.body);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});



//sending data to urls_show.ejs
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  let user_id = req.cookies.id;
  let userObject = users[user_id];
  const templateVars = { shortURL, longURL, userObject };
  res.render("urls_show", templateVars);
});


//shortener /urls/:id
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


//delete url
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

////////////////////////////////////
//edit url
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  console.log(shortURL);
  console.log(req.body.longURL);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

////////////////////////////////////

//login
app.get("/login", (req, res) => {
  let user_id = req.cookies.id;
  let userObject = users[user_id];
  const templateVars = { userObject };
  res.render("urls_login", templateVars);
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let userObject = getUserByEmail(email);
  if (!email || !password) {
    res.status(403).send("Please enter a username and password.");
  }
  if (!userObject) {
    res.status(403).send("Username not found. Please register")
  }
  if (userObject) {
    if (userObject.password !== password) {
      res.status(403).send("Username or password do not match.");
    };
    res.cookie("id", userObject["id"]);
    res.redirect("/urls");
  }
});



//logout
app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.redirect("/login");
});




//register
app.get("/register", (req, res) => {
  /* const templateVars = {
    shortURL: req.params.id,
    longUrl: urlDatabase[req.params.id],
    username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  }; */
  let user_id = req.cookies.id;
  let userObject = users[user_id];
  const templateVars = { userObject };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();
  let newUser = {
    id,
    email,
    password
  };
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Bad request.");
  }
  if (getUserByEmail(email)) {
    res.status(400).send("User already exists.");
  }
  users[id] = newUser;
  res.cookie("id", id)
  res.redirect("/urls");
});









//http://localhost:8080/urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




