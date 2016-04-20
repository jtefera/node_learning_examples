//checkFile.js
//check file
//Modulo fs para trabajar con arcivos
var fs = require("fs");

//Fs.stat(path, callback)
fs.stat("text.txt", function(err, stats){
	//En caso de error
	if(err){
		return console.error(err);
	}
	//En caso de no error. stats es un objeto:
	console.log(stats); //Objeto stats
	console.log(stats.isFile()); //true
	console.log(stats.isDirectory()); //false
})