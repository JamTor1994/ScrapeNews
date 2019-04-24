//npms

var express = require('express');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require("bluebird");

//Mongoose promis

mongoose.Promise = Promise;

//monodb models

var Articles = require("../models/articles");
var Comments = require("../models/comments");

// website for scraping

var url = "https://www.pcgamer.com/news/";

//Test Route for scraping check

router.get('/test', function(req, res){
    //body fo html request
    request(url, function(error, response, html){
        //cheerio loading, save it as $ for shorthand
        var $ = cheerio.load(html);
            var result = [];
            $(".span6").each(function(i, element){
                var title = $(element).find("a").find("img").attr("article-name");
            })
    })
})