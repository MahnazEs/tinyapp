const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


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
  console.log(req.body); // Log the POST request body to the console
  res.send("ok"); // Respond with 'Ok' (we will replace this)
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