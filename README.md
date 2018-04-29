# Learning Notes about NPM, Express, and MongoDB

## NPM

NPM allows ease of setting up our project in terms of modules. It is a very easy-to-use build automation tool which help set-up and manage dependencies.

`npm init -y (or --yes)`

Create package.json with all default values

`npm config set init-author-name {AUTHOR}`

Sets the default values whenever you do npm init.
You can Leave out config and use `npm set`.

`npm install lodash --save-dev`

Save dependencies as a dev-dependency.

`npm install --production`

Install package.json without the dev or test dependencies.

`npm update lodash`

Update package.

`npm list`

List all the dependencies. Use `--depth 0` to see only the first level of dependencies.

`"ejs": "^2.5.9"`

This version number means that major version does not change upon update. Only minor and patch version gets updated.

`npm -g install` 

Installs packages globally.

## Express

Express allows us to write rest API to communicate between our frontend and our backend. 

In this example, we are using ejs to help us create the view for the frontend and we are handling our backend with our index.js.

### Setup
```JS
const express = require('express');
var app = express();
```

### Creating our view:
```JS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
```
This sets the path to our view file in the **views** folder. 

Inside our views folder we have index.ejs which is our initial page.

### ReST Request

First we need a server to listen to our request. We set it up on `http://localhost:3000/` which is done like this with express:

```JS
app.listen(3000, function() {
    console.log('Server started on Port 3000...');
})
```

Now any request sent to `localhost:3000/` will be processed through this **index.js** file.

```JS
app.get('/', function(request, response) {
    response.render('index', {
        title: 'Customers',
        users: docs
    });
});
```
When we go to our page `http://localhost:3000/` we run the body of this function. The response renders the `index.ejs` file in our views folder and pass it a title and users.

Express POST and DELETE works similarly with `app.post` and `app.delete`.

### EJS

For our `index.ejs` file to pick up those variables we use a special ejs syntax.

```
<title><%= title %></title>
```

We are mixing our special ejs code with the default HTML but in-between the title tag, we can see that ejs extract the title property we passed in from our GET request and sets it as the title.

To render our users, ejs has a forEach function so it can process our array object.

```
<ul>
<% users.forEach(function(user) { %>
    <li><%= user.name %> <%= user.age %> - <a href="#" class="deleteUser" data-id="<%= user._id %>">Delete</a> </li>
<% }) %>
</ul>
```

Note here that any special characters needs to be wrapped around with `<% %>`. Notice the lack of the `=` sign as `<%= %>` is used to extract variables.

We can also break down the HTML into multiple parts with the command `<% include partials/header %>`. This command adds the content of the file `header.ejs` in the partials folder to the top of `index.ejs`. We can also see we did the same for the footer file.

## MongoDB

MongoDB is a database software that allows us to store objects for persistence.

MongoDB is a server so in order to use it we need to start the mongoDB. To create our own databse we use the command `use customerapp`. This create a new database called customerapp.

Now we need a collection to store our customer data, so we call `db.createCollection('users')`. 

- To see what's in `users` we can call `db.users.find()`.
- To insert into `users` we can call `db.users.insert([{name: 'Jane', age: 24}])`.

### mongoJS

In order to access MongoDB with our code: we have to include a dependency called **mongojs**.
Then we create a mongojs object with the database name and the collection name we are trying to access.

```JS
const mongojs = require('mongojs');
const db = mongojs('customerapp', ['users']);
```

now we can access users collection with the same command as MongoDB, except now we pass in a call-back function

```JS
db.users.find(function(err, docs) {
    res.render('index', {
        title: 'Customers',
        users: docs
    });
});
```

The `docs` parameter prefers to the data we inserted into `db.users`.

Insert is similar:

```JS
db.users.insert(newUser, function(err, result) {
    if (err) {
        console.log(err);
    }
    res.redirect('/');
});
```

`newUser` is the new data we are going to insert into `db.users`. Also note the `res.redirect('/')` command. This has to do with `express` taking us to the url (`/users/Add`) we are posting so we have to redirect the user back to the main page.

## Other

### Express Validator

We can validate our input with `express-validator`.
Set up:

```JS
const expressValidator = require('express-validator');
app.use(expressValidator());
```

To use the validator, within the REST request callback function we call:

```JS
req.checkBody('name', 'Name is Required.').notEmpty();
var errors = req.validationErrors();
```

If req does not satisfies any of the conditions, errors will be defined. 
We used `notEmpty()` here to check if we passed in an empty field for the name. We can also do `isInt()` to check if the field is a number or not. 
