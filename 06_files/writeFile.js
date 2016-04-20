//writeFile.js
//Escribir con node
//Modulo fs para tratar con archivos
var fs = require("fs");

//fs.writefile(path, data[, options], callback)
	//Options obj con claves {encoding , mode, flags}
	//callback con input err
fs.writeFile(	"writetext.txt", 
				"hola a todos y todas", 
				{
					"encoding" :"ascii",
					"mode" : "0666",
					"flags" : "w"
				},
				function(err){
					if(err) return console.error(err);
					console.log("Data escrita");
					//Para leer el archivo:
					fs.readFile("writetext.txt", function(err, data){
						if(err) return console.error(err);
						console.log("Los datos escritos son:");
						//data viene raw, codificar a ascii
						console.log(data.toString("ascii"));
					});
				});
