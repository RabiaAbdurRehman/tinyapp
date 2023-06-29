# TinyApp Project

## Build a simple multipage app:

- [x] 1. with authentication protection
- [x] 2. reacts appropriately to the user's logged-in state
- [x] 3. permits the user to create, read, update, and delete
     (CRUD) a simple entity (e.g. blog posts, URL shortener).

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

###  Template Engine - EJS:

---

-Add route for /urls in expressserver.js and render using accompanying template
- Add route for /urls/:id in expressserver.js and render using accompanying template
- Include the header partial inside urls_index.ejs and urls_show.ejs. Make sure this is included inside the top of the body.
- Add GET route to expressserver.js and render using accompanying template
- Add POST route to expressserver.js to receive form submission.
- Update expressserver.js to store short-url and long-url key value pair to database when a POST request is received to /urls
- Update expressserver.js to respond with a redirect from /urls to /urls/:id
- In urls_index.ejs template, add a form element for each shortURL which uses a POST method
- Add POST route for /urls/:id/delete to remove URLs
- Add form to urls_show.ejs that submits an updated longURL
- Add Edit button to each object in urls_index.ejs which takes you to appropriate urls_show page
- Add POST route for /urls/:id to update a resource
- Add POST route for /login to expressserver.js
- Redirect browser back to /urls page after successful login
- Modify \_header.ejs to display a username using cookie-parser
- Add a POST route for /logout which clears the cookie and redirects user to /urls page
- Create a new template with a form containing email and password field.
- Email field should use type=email and have name=email
- Password field should use type=password and have name=password
- Form should POST to /register
- Add a GET route for /register which renders the registration template
- Add a POST route for /register which will:
- Add new user object to global users object
- Set userid cookie
- Redirect user to /urls page
- Update all endpoints that pass username value to templates to pass entire user object to template instead and change logic as follows:
- Look up user object in users objects using userid cookie value
- Pass user object to templates
- Update \_header.ejs to show email instead of username
- Create a new template with a login form which contains an email and password field
- Form will send a POST request to /login
- Add a GET route /login that renders the appropriate template
- Modify \_header.ejs to display Register link pointing to Register page
- Modify \_header.ejs to display Login link pointing to Login page for users not logged in
- Modify the registration endpoint to use bcrypt to hash and save password (use bcrypt.hashSync)
- Modify the login endpoint to use bcrypt to check the password (use bcrypt.compareSync)
- All cookie data is encrypted

## Final Product

!["my url page"](/docs/urls-page.png)
!["my login page"](/docs/login.png)
