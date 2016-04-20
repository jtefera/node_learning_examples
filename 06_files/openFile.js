//openfile.js
//Test de apertura de archivo
//Modulo fs para tratar archivos
var fs = require("fs");

//abrir archivo text.txt
fs.open("text.txt", "r+", function(err, fd){
	if(err){
		return console.error(err);
	}
	console.log("Archivo abierto");
})