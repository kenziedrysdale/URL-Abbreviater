const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dns = require('dns');
var cors = require('cors')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const database = require('../model/database.js');

const urlsSchema = new Schema({
  longUrl:  String,
  shortUrl: Number
});

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true});
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB")
});




/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(__dirname + "/index.html")
});

router.get('/api/shorturl/:new', function(req, res, next) {
	id = req.params.new;
		database.redirectUrl(id,function(err,data){
			if(!err){
				res.redirect("http://"+data);
			}
	});
});


router.post("/api/shorturl/new",function(req, res){
	let url = req.body.url;
	dns.lookup(url, (err,address,family) => {
		if(err){
			res.json({"error":"invalid URL"})
		} else{
			database.addUrl(url,function(err,data){
				res.json({"OriginalUrl":req.body.url,"shortUrl":data})
			})
		}
	});
});




module.exports = router;
