//closeFile.js
//Reading files with the read function:
//Modulo fs para leer
var fs = require("fs");

//Abrimos el archivo text.txt
//fs.open(path, flags, callback(err, fd))
fs.open("text.txt", "r+", function(err, fd){
    if(err) return console.error(err);
    console.log("Archivo abierto");
    console.log("----");
    
    //Lectura con read(fd, buffer, offset, length, position, callback)
    //Creamos primero el buffer:
    var buf = new Buffer(256);
    fs.read(fd, buf, 0, 254, null, function(err, bytesRead ){
        if(err) console.error(err);
        //Datos leidos. Archivo utf8. Transdormar raw a utf8
        //Los datos están en el buffer
        //Puede que haya parte del buffer que no ha sido ocupado(como por ejemplo cuando la long es menor que el buf.length)
        //En dicho caso, los elementos adicionale contienen basura.
        //BytesRead nos da el número de bytes leidos:
        console.log(buf.slice(0, bytesRead).toString());
        console.log("----");
        console.log("Archivo leido");

        //Una vez leido, cerramos el archivo:
        fs.close(fd, function(err) {
            if(err) return console.error(err);
            console.log("Archivo cerrado!");
        });
    });
});