//uncompress.js
//Leemeos desde readMyStream.txt.gz, descomprimimos y escribimos en readMyStreamDesc.txt
//Requerimos fs para lectura escritura de datos
var fs = require("fs");
//Libreria zlib que ya viene con node
var zlib = require("zlib");

//Stream de lectura desde readMyStream.txt.gz
var readStream = fs.createReadStream("readMyStream.txt.gz");

//Stream de escritura en readMyStreamDesc.txt
var writeStream = fs.createWriteStream("readMyStreamDesc.txt");

//El stream de lectura lo pasamos por la función de compresión que crea un stream que lo pasamos al stream de escritura
readStream.pipe(zlib.createGunzip())
          .pipe(writeStream);
    