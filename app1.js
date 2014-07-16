var express = require('express');
var request = require('request');
var loopback = require('loopback');
var app = module.exports = loopback();

request('https://api.github.com/repos/caolan/async/collaborators',function(error,response){
	console.log(response.body);
	if(!error && response.statusCode == 200){
		var obj = JSON.parse(body);
		console.log(obj);	
	}
	else{
	console.log('Error :' + error);
	}
});
