//Vamos a crear un stream a partir de la lectura de un archivo existente en el directoorio llamado text.txt

//Requerimos del modulo de lectura de archivos
var fs = require("fs");

//Contendrá los datos que vayamos leyendo
var data = "";
    
//Creamos un stream desde el que podremos leer:
var readerStream = fs.createReadStream("text.txt");

//Designamos el encoding para dicho texto:
readerStream.setEncoding("utf8");

//Asignamos un listener a dicho stream para cuando llegan datos
//Los datos van llegando en cachos desde el buffer
readerStream.on("data", function(chunkOfData) {
    data += chunkOfData;
});

//Cuando acabamos de leer los datos del archivo, los devolvemos a la consola
//Asignamos un listener al evento "end" que se lanza cuando se ha acabado la lectura
readerStream.on("end", function(){
    console.log(data);
});

//Asignamos un listener al caso de tener errores
readerStream.on("error", function(err){
    console.log(err.stack);
});
