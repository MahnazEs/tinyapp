# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Register Page"](https://github.com/MahnazEs/tinyapp/blob/master/docs/register_page.png?raw=true)
!["Login Page"](https://github.com/MahnazEs/tinyapp/blob/master/docs/login_page.png?raw=true)
!["Main Page"](https://github.com/MahnazEs/tinyapp/blob/master/docs/urls_main_page.png?raw=true)
!["New Url Page"](https://github.com/MahnazEs/tinyapp/blob/master/docs/urls_new_page.png?raw=true)
!["Edit Url Page"](https://github.com/MahnazEs/tinyapp/blob/master/docs/urls_edit_page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.


## Project Requirements

## Additional Requirements
Site Header:
if a user is logged in, the header shows:
the user's email
a logout button which makes a POST request to /logout
if a user is not logged in, the header shows:
a link to the login page (/login)
a link to the registration page (/register)


## Route Checklist

- GET /.
if user is logged in:
(Minor) redirect to /urls
if user is not logged in:
(Minor) redirect to /login

- GET /urls.
if user is logged in:
returns HTML with:
the site header (see Display Requirements above)
a list (or table) of URLs the user has created, each list item containing:
a short URL
the short URL's matching long URL
an edit button which makes a GET request to /urls/:id
a delete button which makes a POST request to /urls/:id/delete
(Stretch) the date the short URL was created
(Stretch) the number of times the short URL was visited
(Stretch) the number number of unique visits for the short URL
(Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new

if user is not logged in:
returns HTML with a relevant error message

- GET /urls/new.
if user is logged in:
returns HTML with:
the site header (see Display Requirements above)
a form which contains:
a text input field for the original (long) URL
a submit button which makes a POST request to /urls
if user is not logged in:
redirects to the /login page

- GET /urls/:id.
if user is logged in and owns the URL for the given ID:
returns HTML with:
the site header (see Display Requirements above)
the short URL (for the given ID)
a form which contains:
the corresponding long URL
an update button which makes a POST request to /urls/:id
(Stretch) the date the short URL was created
(Stretch) the number of times the short URL was visited
(Stretch) the number of unique visits for the short URL
if a URL for the given ID does not exist:
(Minor) returns HTML with a relevant error message
if user is not logged in:
returns HTML with a relevant error message
if user is logged it but does not own the URL with the given ID:
returns HTML with a relevant error message

- GET /u/:id.
if URL for the given ID exists:
redirects to the corresponding long URL
if URL for the given ID does not exist:
(Minor) returns HTML with a relevant error message

- POST /urls.
if user is logged in:
generates a short URL, saves it, and associates it with the user
redirects to /urls/:id, where :id matches the ID of the newly saved URL
if user is not logged in:
(Minor) returns HTML with a relevant error message

- POST /urls/:id.
if user is logged in and owns the URL for the given ID:
updates the URL
redirects to /urls
if user is not logged in:
(Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
(Minor) returns HTML with a relevant error message

- POST /urls/:id/delete.
if user is logged in and owns the URL for the given ID:
deletes the URL
redirects to /urls
if user is not logged in:
(Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
(Minor) returns HTML with a relevant error message

- GET /login.
if user is logged in:
(Minor) redirects to /urls
if user is not logged in:
returns HTML with:
a form which contains:
input fields for email and password
submit button that makes a POST request to /login

- GET /register.
if user is logged in:
(Minor) redirects to /urls
if user is not logged in:
returns HTML with:
a form which contains:
input fields for email and password
a register button that makes a POST request to /register

- POST /login.
if email and password params match an existing user:
sets a cookie
redirects to /urls
if email and password params don't match an existing user:
returns HTML with a relevant error message

- POST /register.
if email or password are empty:
returns HTML with a relevant error message
if email already exists:
returns HTML with a relevant error message
otherwise:
creates a new user
encrypts the new user's password with bcrypt
sets a cookie
redirects to /urls

- POST /logout.
deletes cookie
redirects to /login
