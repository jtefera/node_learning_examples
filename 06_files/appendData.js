//appendData.js
//Cada vez que se llama a este archivo, 
//añade al final del texto la fecha a la que se hizo
//Modulo fs para tratar con archivos
var fs = require("fs");

var filepath = "appending.txt";

//Tiempo actual más salto de linea
var textToAppend = Date() + "\r\n";

//appendFile, añade textToAppend al final del archivo filepath
fs.appendFile(filepath, textToAppend, function(err) {
	if(err) return console.log(err);
	console.log("Fecha Añadida!");
});

