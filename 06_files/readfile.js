//readfile.js
//Module for working with files
var fs = require("fs");

//Async reading of files. readFile(path, callback). Callback receives err and data as input
fs.readFile("text.txt", function(err, data){
	if(err){
		return console.error(err);
	}
	//Data es un buffer por lo que hay transformarlo.
	//Encoding default utf8
	console.log("Los datos del archivo text.txt:");
	console.log(data.toString());
	console.log("Fin datos");

});