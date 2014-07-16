var loopback = require('loopback');
var express = require('express');
var path = require('path');
var request = require('request');
var underscore = require('underscore');
var app = module.exports = loopback();
var started = new Date();

/*
 * 1. Configure LoopBack models and datasources
 *
 * Read more at http://apidocs.strongloop.com/loopback#appbootoptions
 */

app.boot(__dirname);

/*
 * 2. Configure request preprocessing
 *
 *  LoopBack support all express-compatible middleware.
 */

app.use(loopback.favicon());
app.use(loopback.logger(app.get('env') === 'development' ? 'dev' : 'default'));
app.use(loopback.cookieParser(app.get('cookieSecret')));
app.use(loopback.token({model: app.models.accessToken}));
app.use(loopback.bodyParser());
app.use(loopback.methodOverride());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/',function(req,res){
	res.render('index',{title :'NPM Search'});
});

app.post('/', function(req,res){
	console.log('Input is :'+ req.body.input);
	var url = 'http://isaacs.iriscouch.com/registry/';
    url = url + req.body.input;
    
	request(url,function(error,response,body){
		var obj = JSON.parse(body);
		obj = parseobj(obj,req.body.input);
		if(req.body.button == '2')
			console.log('Input is :'+ req.body.input);
		if(req.body.button == '2' && obj["Flag"] === '0')
		{
			myapp.upsert({id : obj["LV_Name"],
				LV_Name : obj["LV_Name"],
				Latest_Version : obj["Latest_Version"],
				Decription : obj["Descripiton"],
				Author : obj["LV_Author"],
				GIT_Repository : obj["GIT_repository"],
				Home_Page : obj["Home_Page"],
				Bugs : obj["Bugs"],
				License : obj["License"],
				Dependencies : obj["Dependencies"],
				Contributors : obj["Contributors"],
				Maintainers : obj["Maintainers"],
				Read_Me : obj["Read_Me"]},
				
				function(err,information){
					if(err){console.log('error in saving into database');}
					else {console.log('Successful saving!');}
				});
			
			myapp.find({},function(err,obj1){
				if(err) res.send('Error in loading page..');
				console.log(obj1.length);
				var obj2 = [];
				for(var i = 0; i < obj1.length; i++){
					var obj3 = {};
					obj3['id'] = obj1[i].id;
					obj2.push(obj3);
					//console.log(obj3);
				}
				console.log('');
				console.log(obj2);
				res.render('database',{title : req.body.input, "Result" : obj2});
			});
			
		}
		else
			res.render('index',{title : req.body.input, "Result" : obj});
	
	});
});

app.post('/database', function(req,res){
	var id = req.body.input;
	myapp.findById(id, function(err,instance){
		if(err) res.send('Error in fetching data from database');
		else{
			instance['Flag'] = '0';
			instance['LV_Name'] = instance.id;
			
			res.render('index',{title : instance.id, "Result" : instance});
		}
		
	});
});

function parseobj(obj,input)
{
	var object = {}; 
	if(obj.error === 'not_found')
	{
		object['Messege'] = 'No data for \"' + input + '\"';
		return object;
	}
	
			
			//Latest version
			if(!underscore.isUndefined(obj['dist-tags' ].latest)){
				var version = obj['dist-tags' ].latest;
				object["Latest_Version"] = version;			
			}
			console.log('Done with version');
	
			//Fetching Name
			if(!underscore.isUndefined(obj.versions[version].name)){
				object["LV_Name"] = obj.versions[version].name;
			}
			console.log('Done with name');

			//Description
			if(!underscore.isUndefined(obj.versions[version].description)){
				object["Description"] = obj.versions[version].description;
			}
			console.log('Done with description');

			//Author
			if(!underscore.isUndefined(obj.versions[version].author)){	
				object["LV_Author"] = obj.versions[version].author.name;
			}
			console.log('Done with author');

			//Read Me
			if(!underscore.isUndefined(obj.readme)){	
				object["Read_Me"] = obj.readme;	
			}
			console.log('Done with Read me');

			//License
			if(!underscore.isUndefined(obj.versions[version].license)){	
				object["License"] = obj.versions[version].license;
			}
			console.log('Done with License');
	
			//GIT repository
			console.log(obj.versions[version].repository);	
			if(!underscore.isUndefined(obj.versions[version].repository)){	
				object["GIT_Repository"] = obj.versions[version].repository.url;
			}
			console.log('Done with GIT');

			//Homepage
			if(!underscore.isUndefined(obj.versions[version].homepage)){	
				object["Homepage"] = obj.versions[version].homepage;
			}
			console.log('Done with Homepage');	

			//Fetching Contributors
			if(!underscore.isUndefined(obj.versions[version].contributors)){				
				object["Contributors"] = [];
				if(!underscore.isUndefined(obj.versions[version].contributors)){
					var names = underscore.map(obj.versions[version].contributors, function(name,email){return name});
					object["Contributors"] = names;
				}
			}
			console.log('Done with Contributors');

			//Bugs
			if(!underscore.isUndefined(obj.versions[version].bugs)){				
				object["Bugs"] = obj.versions[version].bugs.url;
			}
			console.log('Done with Bugs');

			//Maintainers
			if(!underscore.isUndefined(obj.versions[version].maintainers)){				
				object["Maintainers"] = obj.versions[version].maintainers;
			}
			console.log('Done with Maitainers');

			//Fetching dependencies
			if(!underscore.isUndefined(obj.versions[version].dependencies)){				
				var keys = underscore.map(obj.versions[version].dependencies, function(num,key){return key});
				var values = underscore.map(obj.versions[version].dependencies, function(num,key){return num});		

				console.log(keys.length);
				if(keys.length == 0);
				else{
					var txt = '{"Depend" :[';
					for(var i = 0; i<keys.length; i++)
					{
						if(i!=0)
							txt = txt + ',';
						txt = txt + '{\"key\":\"' + keys[i] + '\",';	
						txt = txt + '\"value\":\"' + values[i] + '\"}';
					}
					txt = txt + ']}';
					console.log(txt);
					var jobj = JSON.parse(txt);
					object["Dependencies"] = jobj;
				}
				
			}
			console.log('Done with Dependencies');
			//Setting Clear flag
			object["Flag"] = '0';			

	return object;
}
/*
 * EXTENSION POINT
 * Add your custom request-preprocessing middleware here.
 * Example:
 *   app.use(loopback.limit('5.5mb'))
 */

/*
 * 3. Setup request handlers.
 */

// LoopBack REST interface
app.use(app.get('restApiRoot'), loopback.rest());

// API explorer (if present)
try {
  var explorer = require('loopback-explorer')(app);
  app.use('/explorer', explorer);
  app.once('started', function(baseUrl) {
    console.log('Browse your REST API at %s%s', baseUrl, explorer.route);
  });
} catch(e){
  console.log(
    'Run `npm install loopback-explorer` to enable the LoopBack explorer'
  );
}

/*
 * EXTENSION POINT
 * Add your custom request-handling middleware here.
 * Example:
 *   app.use(function(req, resp, next) {
 *     if (req.url == '/status') {
 *       // send status response
 *     } else {
 *       next();
 *     }
 *   });
 */

// Let express routes handle requests that were not handled
// by any of the middleware registered above.
// This way LoopBack REST and API Explorer take precedence over
// express routes.
app.use(app.router);

// The static file server should come after all other routes
// Every request that goes through the static middleware hits
// the file system to check if a file exists.
app.use(loopback.static(path.join(__dirname, 'public')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

/*
 * 4. Setup error handling strategy
 */

/*
 * EXTENSION POINT
 * Add your custom error reporting middleware here
 * Example:
 *   app.use(function(err, req, resp, next) {
 *     console.log(req.url, ' failed: ', err.stack);
 *     next(err);
 *   });
 */

// The ultimate error handler.
app.use(loopback.errorHandler());


/*
 * 5. Add a basic application status route at the root `/`.
 *
 * (remove this to handle `/` on your own)
 */

app.get('/', loopback.status());

/*
 * 6. Enable access control and token based authentication.
 */

var swaggerRemote = app.remotes().exports.swagger;
if (swaggerRemote) swaggerRemote.requireToken = false;

app.enableAuth();

/*
 * 7. Optionally start the server
 *
 * (only if this module is the main module)
 */

app.start = function() {
  return app.listen(function() {
    var baseUrl = 'http://' + app.get('host') + ':' + app.get('port');
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
  });
};

if(require.main === module) {
  app.start();
  var myapp = app.models.info;
}
