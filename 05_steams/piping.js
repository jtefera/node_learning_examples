//Leemeos desde readMyStream.txt y escribimos en writtedWithPipe.txt
//Requerimos fs para lectura escritura de datos
var fs = require("fs");

//Stream de lectura desde readMyStream.txt
var readStream = fs.createReadStream("readMyStream.txt");

//Stream de escritura en writtedWithPipe.txt
var writeStream = fs.createWriteStream("writtedWithPipe.txt");

//Escribir en write lo que leemos en read
readStream.pipe(writeStream);