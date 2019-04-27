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

var url = "https://dotesports.com/"

//Test Route for scraping check

router.route('/test').get(function (req, res) {
    //body fo html request
    request(url, function (error, response, html) {
        //cheerio loading, save it as $ for shorthand
        var $ = cheerio.load(html);
        var result = [];
        $("article").each(function (i, element) {
            // console.log(element.text())
            var title = $(element).children(".entry-post").children(".entry-title").children("a").text()
            var imgLink = $(element).children(".entry-media").children(".tw-thumbnail")
            var storylink = $(element).children(".entry-post").children(".entry-title").children("a").attr("href")
            var summary = $(element).children(".entry-post").children(".entry-content").children("p").text()
            console.log(storylink)
            console.log(summary)
            // console.log(String(imgLink))
            console.log(title);
        })
    })
});

//Default route renders the index handlebars view
router.get('/', function(req, res){
	res.render('index');
});

// Scrape the website and assign stories to the database. Checks to verify story has not been added previously.
router.get('/scrape', function(req, res){
    request(url, function(error, response, html) {	
        var $ = cheerio.load(html);
		var result = [];
		// Scrape website
		$("article").each(function(i, element) {
            var title = $(element).children(".entry-post").children(".entry-title").children("a").text()
            var imgLink = $(element).children(".entry-media").children(".tw-thumbnail")
            var storyLink = $(element).children(".entry-post").children(".entry-title").children("a").attr("href")
            var summary = $(element).children(".entry-post").children(".entry-content").children("p").text()
			result[i] = ({ 
				title: title,
				imgLink: imgLink,
				storyLink: storyLink,
				summary: summary
			});	
			// Check database to see if story saved previously to database
			Articles.findOne({'title': title}, function(err, articleRecord) {
				if(err) {
					console.log(err);
				} else {
					if(articleRecord == null) {
						Articles.create(result[i], function(err, record) {
							if(err) throw err;
							console.log("Record Added");
						});
					} else {
						console.log("No Record Added");
					}					
				}
			});	
		});
    });	
});

// Get all current articles in database
router.get('/articles', function(req, res){
	Articles.find().sort({ createdAt: -1 }).exec(function(err, data) { 
		if(err) throw err;
		res.json(data);
	});
});

// Get all comments for one article
router.get('/comments/:id', function(req, res){
	Comments.find({'articleId': req.params.id}).exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			res.json(data);
		}	
	});
});

// Add comment for article
router.post('/addcomment/:id', function(req, res){
	console.log(req.params.id+' '+req.body.comment);
	Comments.create({
		articleId: req.params.id,
		name: req.body.name,
		comment: req.body.comment
	}, function(err, docs){    
		if(err){
			console.log(err);			
		} else {
			console.log("New Comment Added");
		}
	});
});

// Delete comment for article
router.get('/deletecomment/:id', function(req, res){
	console.log(req.params.id)
	Comments.remove({'_id': req.params.id}).exec(function(err, data){
		if(err){
			console.log(err);
		} else {
			console.log("Comment deleted");
		}
	})
});

module.exports = router