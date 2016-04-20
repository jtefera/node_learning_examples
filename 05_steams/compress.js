//compress.js
//Leemeos desde readMyStream.txt, comprimimos y escribimos en readMyStream.txt.gz
//Requerimos fs para lectura escritura de datos
var fs = require("fs");
//Libreria zlib que ya viene con node
var zlib = require("zlib");

//Stream de lectura desde readMyStream.txt
var readStream = fs.createReadStream("readMyStream.txt");

//Stream de escritura en writtedWithPipe.txt
var writeStream = fs.createWriteStream("readMyStream.txt.gz");

//El stream de lectura lo pasamos por la función de compresión que crea un stream que lo pasamos al stream de escritura
readStream.pipe(zlib.createGzip())
          .pipe(writeStream);
