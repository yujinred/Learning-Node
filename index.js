const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

// View Engine

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

//global variables
app.use(function(req, res, next) {
    res.locals.errors = null;
    next();
});

app.use(expressValidator());

app.get('/', function(req, res) {
    
    db.users.find(function(err, docs) {
        res.render('index', {
            title: 'Customers',
            users: docs
        });
    })    
});

app.post('/users/Add', function(req, res) {

    req.checkBody('name', 'Name is Required.').notEmpty();
    req.checkBody('age', 'Age is required').notEmpty();
    req.checkBody('age', 'age is a number').isInt();

    var errors = req.validationErrors();

    if (errors) {
        res.render('index', {
            title: 'Customers',
            users: people,
            errors: errors
        });
        console.log('ERROR');
    } else {
        var newUser = {
            name: req.body.name,
            age: req.body.age
        };

        db.users.insert(newUser, function(err, result) {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
    
        console.log('SUCCESS');
    }

    
});

app.delete('/users/delete/:id', function(req, res) {
    db.users.remove({_id: ObjectId(req.params.id)}, function(err){
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    })
})

app.listen(3000, function() {
    console.log('Server started on Port 3000...');
})
