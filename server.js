//needed npm packages
var express =  require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express ();
var mongoose = require('mongoose')

var app = express();

//public
app.use(express.static(_dirname+ 'public'));
var port = process.env.PORT || 3000;

//Database
require("./config/connection");

//morgan log
app.use(logger("dev"));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//handlebars
var expressHandlebars =  require('express-handlebars');
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// routes

var routes = require('./controller/pcnews.js')
app.use('/', routes);

//404 Error
app.use(function(req, res){
    res.render('404');
});

//port

app.listen(port, function(){
    console.log("listening on port:" + port);
})