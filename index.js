var request = require("request"),
twitter = require("ntwitter"),
fs = require("fs"),
path = require("path"),
the_path = path.join(__dirname, "tweeted.json"),
tweeted;

var write_tweeted_to_file = function(){
	fs.writeFile(the_path, JSON.stringify(tweeted), function(err){
		if(err){
			console.log("Could not save "+the_path+": exiting the run loop so as to avoid duplicate tweets and nasty problems..");
			throw err;
		}
	});
}

var check_for_sploit = function(){
	request('http://dayswithoutansslexploit.com/api/', function(error, response, body){
		if(error){
			console.log(error);
			return;
		}
		var json = JSON.parse(body);
		if(!json){
			console.log("No response body sent. Aborting.");
			return;
		}
		if(json["days"] != 0){
			console.log("It has been more than 0 days since the last exploit. Skipping.");
			return;
		}
		var name = json["list"][0]["name"];
		if(tweeted[name]){
			console.log("Already tweeted this one. Skipping.");
			return;
		}
		tweeted[name] = true;
		var twit = new twitter(
			//Keys here
		);
		twit.verifyCredentials(function(err, data){
			if(err){
				console.log(err);
				return;
			}
		}).updateStatus("New SSL exploit: "+name+". dayswithoutansslexploit.com #resettheclock.", function(err, data){
			if(err){
				console.log(err);
				return;
			}
		});
		write_tweeted_to_file();
	});
}

fs.exists(the_path, function(exists){
	if(exists){
		fs.readFile(the_path, function(err, data){
			if(err){
				console.log("Failed to open "+the_path+", even though it supposedly exists. Stopping script.");
				throw err;
			}
			var t = JSON.parse(data);
			if(!t){
				console.log("Failed to parse tweeted.json. Stopping script.");
				throw err;
			}
			tweeted = t; //Could get rid of t altogether, but this seems to make more sense to most people.
		});
	}else{
		tweeted = {};
	}
});
setInterval(check_for_sploit, 60000);