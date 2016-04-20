//adRead.js
//Reading files with the read function:
//Modulo fs para leer
var fs = require("fs");

//Abrimos el archivo text.txt
//fs.open(path, flags, callback(err, fd))
fs.open("text.txt", "r+", function(err, fd){
	if(err) return console.error(err);
	console.log("Archivo abierto");

	//Lectura con read(fd, buffer, offset, length, position, callback)
	//Creamos primero el buffer:
	var buf = new Buffer(256);
	fs.read(fd, buf, 0, 254, null, function(err, bytesRead ){
		if(err) console.error(err);
		//Datos leidos. Archivo utf8. Transdormar raw a utf8
		console.log(buf.slice(0, bytesRead).toString());
		console.log("Archivo leido");
	});
});