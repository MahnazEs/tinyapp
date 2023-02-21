const express = require("express");
const app = express();
const PORT = 8080; // default port 8080




//to short url
const generateRandomString = () => {
  let output = Math.random().toString(36).replace(/[^a-z+0-9]+/g, '').substr(0, 6);
  return output;
};




//translate body
app.use(express.urlencoded({ extended: true }));



//set ejs
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
  console.log(urlDatabase);
  console.log("short url: ", shortUrl);
  res.redirect('/urls');
  //res.send("ok"); // Respond with 'Ok' (we will replace this)
});



//sending data to urls_show.ejs
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]/* What goes here? */ };
  res.render("urls_show", templateVars);
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










app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});






/* app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 }); */