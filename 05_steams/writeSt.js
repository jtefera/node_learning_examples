//writeSt.js
//Creareamos un stream que escribira sobre el archivo writeMe.txt

//Requerimos de fs
var fs = require("fs");

//Datos a ecribir
var data = "Adios Mi Amor";

//Creamos un writable stream. Si no existe el archivo, lo crea.
var writableStream = fs.createWriteStream("writeMe.txt");

//Escribimos en dicho stream
writableStream.write(data, "UTF8");

//Cerramos dicho stream
writableStream.end();

//Creamos un listener para cuando se acabe de escribir:
writableStream.on("finish", function(){
   console.log("Datos escritos!");
});

//En caso de error
writableStream.on("error", function(err){
   console.log(err.stack);
});