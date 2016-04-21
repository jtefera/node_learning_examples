//truncate.js
//Abriremos un archivo
//Lo truncaremos y lo volvemos a leer ya truncado
//Modulo fs para tratar con files
var fs = require("fs");
var filename = "text2.txt";

//Opening the file in read/write mode
fs.open(filename, "r+", function(err, fd){
	if(err) return console.log(err);
	console.log("Archivo abierto");
	//Leemos el archivo antes de truncar
	var buf = new Buffer(2048);
	fs.read(fd, buf, 0, buf.length, 0, function(err, bytesRead){
		if(err) return console.log(err);
		console.log("Archivo leido antes de modificación:");
		console.log(buf.slice(0, bytesRead).toString());

		if(bytesRead<=5) {
			return console.log("The file is to small to continue. Put more text.")
		}
		console.log("-----BR1" + bytesRead);

		//Hacemos el truncado. La long será lo leido menos 5 bytes
		//ftruncate(fd, len, callback)
		fs.ftruncate(fd, 10, function(err){
			if(err) return console.log(err);
			console.log("Archivo truncado");
			//Vamos a leer el archivo truncado:
			console.log("-----BR2" + (bytesRead-5));
			fs.read(fd, buf, 0, buf.length, 0, function(err, bytesRead2) {
				if(err) return console.log(err);

				console.log("Leyendo el archivo truncado");
				console.log(buf.slice(0, bytesRead2).toString());
				console.log("Archivo Final Leido");
				fs.close(fd, function(err){
					if(err) return console.log(err);
					console.log("Archivo Cerrado");
				})
			});
		});


	});

});
