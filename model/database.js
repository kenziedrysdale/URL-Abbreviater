const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlsSchema = new Schema({
  longUrl:  String,
  shortUrl: Number
});
var urlTemplate = mongoose.model('url', urlsSchema);

 exports.addUrl = function(urlToAdd,callback){
 	console.log(urlToAdd);
 	urlTemplate.countDocuments(function(err,count){
 		if(count===0 && !err){
 			const url = new urlTemplate({ longUrl: urlToAdd, shortUrl: 1 });
      		url.save(function(err, data) {
		        if (err) {          
		          return callback(err, null);
		        } else {          
		          return callback(null, data.shortUrl);
		        }
	    	});
 		} else if(err){
 			return callback(err,null)
 		} else{
 			findLargestUrl(function(err,data){
  				const url = new urlTemplate({ longUrl: urlToAdd, shortUrl: data+1 });
	      		url.save(function(err, data) {
			        if (err) {          
			          return callback(err, null);
			        } else {          
			          return callback(null, data.shortUrl);
			        }
		    	});
 			});
 		}
 	});

}

 exports.redirectUrl = function(id,callback){
  urlTemplate.findOne({shortUrl:id}, function(err, data) {
    if(err) return callback(err);
    return callback(null, data.longUrl)
  });
}



  function findLargestUrl(callback) {
    urlTemplate.find().sort({ shortUrl:-1 }).limit(1)
      .exec(function(err, data) {
      if (err) return callback(err, null); 
      return callback(null, data[0].shortUrl);
    });
  };
