const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const helpers = require("./helper");
const bcrypt = require("bcryptjs");




//middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  secret: 'asdfghjkl'
}));

//config
app.set("view engine", "ejs");


//to short url
const generateRandomString = () => {
  let output = Math.random().toString(36).replace(/[^a-z+0-9]+/g, '').substr(0, 6);
  return output;
};



const userUrlsFnc = (user_id) => {
  let userURLS = {};
  for (let key in urlDatabase)
    if (urlDatabase[key].user_id === user_id) {
      userURLS[key] = urlDatabase[key];
    }
  return userURLS;
};



//URL database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", user_id: "userRandomID" },
  i3BoGr: { longURL: "http://www.google.com", user_id: "userRandomID" }
};

//user database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@yahoo.com",
    password: "123",
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "4567",
  },
};


//sending deta to urls_index.ejs , http://localhost:8080/urls
app.get("/urls", (req, res) => {
  let user_id = req.session.user_id;
  let templateVars = {
    user_id,
    user: users[user_id],
    urlDatabase: userUrlsFnc(user_id)
  };
  if (!user_id) {
    res.status(400).send("Please login.");
  } else {
    res.render("urls_index", templateVars);
  }
});


//render urls_new.ejs
app.get("/urls/new", (req, res) => {
  let user_id = req.session.user_id;
  if (user_id) {
    let templateVars = { user_id: user_id, user: users[user_id] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});


//get data from the form in body and translate it
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  let user_id = req.session.user_id;
  let mainObject = {
    longURL,
    user_id,
    user: users[user_id],
  };
  if (!user_id) {
    res.status(403).send("Please login.");
    return;
  }
  if (longURL) {
    urlDatabase[shortURL] = mainObject;
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(403).send("Invalid entry");
  }
});


//sending data to urls_show.ejs
app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.session.user_id;
  let shortURL = req.params.shortURL;
  if (!req.session.user_id) {
    res.status(403).send("Please login.")
    return;
  } 
  if (!urlDatabase[shortURL]) {
    res.status(404).send("No URL with that ID exists.")
    return;
  }
  const templateVars = {
    shortURL,
    user: users[user_id],
    longURL: urlDatabase[shortURL].longURL,
    user_id: req.session.user_id,
    email: req.session.email,
  };
  res.render("urls_show", templateVars);
});


//shortener /urls/:id
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  if (!longURL) {
    res.status(403).send("No URL with that ID exists.")
    } else {
  res.redirect(longURL);
 }
});


//delete url
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    res.status(403).send("Request to delete URL denied.")
    return;
  }
  if (user_id !== urlDatabase[shortURL].user_id) {
    res.status(403).send("Request to delete URL denied.")
    return;
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
/*  delete urlDatabase[req.params.shortURL];
 res.redirect("/urls");
}); */


//edit url
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  if (!req.session["user_id"]) {
    res.redirect("/urls");
  } else if (urlDatabase[shortURL].user_id === req.session["user_id"]) {
    urlDatabase[req.params.shortURL].longURL = longURL;
    res.redirect("/urls/");
  } else {
    res.redirect("/urls");
  }
});



//login
app.get("/login", (req, res) => {
  let user_id = req.session.user_id;
  res.render("urls_login", { user: users[user_id] });
});


app.post("/login", (req, res) => {
  let {email, password} = req.body;
  let userObject = helpers.getUserByEmail(email, users);
  if (!email || !password) {
    res.status(403).send("Please enter a username and password.");
  }
  if (!userObject) {
    res.status(403).send("Username not found. Please register");
  }
  if (!bcrypt.compareSync(password, userObject.password)) {
    res.status(403).send("Username or password do not match.");
  } else {
    req.session.user_id = userObject.user_id;
    res.redirect("/urls");
  }
});



//logout
app.post("/logout", (req, res) => {
  res.session = null;
  res.redirect("/login");
});


//register
app.get("/register", (req, res) => {
  res.render("register", { user: users[req.session.user_id] });
});


app.post("/register", (req, res) => {
  const id = generateRandomString();
  let { email, password } = req.body;
  let hashpassword = bcrypt.hashSync(password, 10);
  let newUser = {
    id,
    email,
    password: hashpassword
  };
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Please enter username or password.");
  }
  if (helpers.getUserByEmail(email, users)) {
    res.status(400).send("Please login.");
  } else {
    users[id] = newUser;
    req.session.user_id = id;
    res.redirect("/urls");
  }
});


app.get("/", (req, res) => {
  res.redirect("/login");
});


//http://localhost:8080/urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`TinyApp server listening on port ${PORT}!`);
});




