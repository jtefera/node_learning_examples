BASIC NOTES ON NODE.JS / SPANGLISH
***

#01 Basic: Iniciar un servidor básico:

```
//en basic.js
//Required modules.
var http = require("http");

    //Creating an HTTP the server that listens to the port 8081
    http.createServer(function (request,response){
        //Request is the data sent to the server
        //Response is the data sent from the server to the client
        //Respondemos enviando un header con el status(200, todo correccto)
        //y el tipo de archivo
        response.writeHead(200, {"Content-type":"text/plain"});

        //Escribir un Hello world a todas las páginas que aparecen y 
        //cerrar la respuesta al cliente
        response.end("Hello world :)");
    }).listen(8081);

//Notificación que se envia a la consola del servidor y no a la del cliente
console.log("Servidor creado");
```

```
//En terminal
node server.js
```

#02 Basic Modules: Iniciar un paquete en npm
```
//en terminal
npm init

//Rellenar datos que pediran

//Tras rellendado datos, añadirnos como usuarios
npm adduser
//Pedira username, contraseña y email

//Publicar al repositiorio de modulos de npm. 
//Si no va, comprobar que el nombre no está usado
npm publish
```


# 03 ReadFile: Reading a file async

```
//en readFileTut.js
//To create a server if needed
var http = require("http");

//TO read and write files
var fs = require("fs");

//Async function to read files,
//Path to file, func for err and data
//See how all callback function receive err and data inputs
fs.readFile("index.txt", function(err, data){
    if(err) return console.err(err);
    console.log(data.toString());
});

//ProgramEnded
console.log("Finished!");
```


#04 Events
Node is an event driven language. We build multiple observers for different kinds of events and when one is emmited, the function adhered to the oberved is called. Events can be a client connection, a get request, a change in a state, etc. Node has also the ability to create its own events and fire them at please. For that it uses the events module:

```
//In a file
//Require events, in-build with node, no need to install
var events = require("events");
//Require HTTP for server purposes
var http = require("http");

//Creating the event emmiter object. It handles all the events
var eventEmitter = new event.eventEmitter();

//Function to emit when the event "connection" is fired:
function sayHello(){
    console.log("Hello");
    //Fires the "data_received" event
    eventEmitter.emit("data_received");
}

//Creates a "connection" event and binds it with the function sayHello
eventEmitter.on("connection", sayHello);

//Creates the event "data_received" and binds it with an anon function
eventEmitter.on("data_received",function(){
   console.log("Data received!");
});

//Server creation listening in port 8081
http.createServer(function(request,response) {
    //Send header with the following info:
    //Status: 200, all correct
    //Connection-type: text
    response.writeHead(200, {"Connection-type": "text/plain"});
    
    //Send "Hello" in the webpage and end the connection
    response.end("Hello World!");
    
    //Fire the "connection" event
    eventEmitter.emit("connection");
});
```

###EventEmitter methods:
-addListener(event, listener): es igual que on(event, listener). Tanto on como addListener devuelven el eventEmitter por lo que se pueden encadenar varios a la vez; Lanza el newListener event  
-on(event, listenr): Igual que addListener  
-once(event, listener): El listener es ejecutado solo la primera vez que el event es fired. Tras ello es removido. Devuelve emitter  
-removeListener(event, listener): quita un listener del event. Devuelve eventEmitter. Lanza el removeListener event. Para poder removerlo, el listener en addListener o en on debe ser una función no anonima. El listener en removeListener será por tanto el nombre de dicha función.  
-setMaxListeners(n): Por defecto, node da un warning si hay más de 10 listener para un evento dado. Con setMaxListeners se puede aumentar o decrementar dicho número. 0 para ilimitado.  
-listeners(event): devuelve lista de listeners para un elemento dado  
-emit(event, [arg1], [arg2], ...): Lanza un elemento con argumentos opcionales. Devuelve true si el evento tenía listers y falso en cao contrario.  

###Funciones que aceptan eventEmitters:
-listenerCount(emmiter, event): devuelve el número de listeners para un evento dado. No recomendado. Mejor 

###Eventos que son lanzados:
-newListener: Se lanza cada vez que un listener es añadido. Devuelve nombre del event y la función listener. El evento es lanzado antes que el listener es añadido al event. Eso hace que podamos añadir otro listener antes que dicho event con once(basado en el código anterior):

```
//Lanzado una vez cuando un evento es enviado
//(con on o addListener, no es lo mismo que emit)
eventsEmitter.once("newListener", function(event, listenr){
    //Vamos a añadir un nuevo listener al evento myEvent
   if(event == "myEvent") {
    //Solo estamos haciendo un binding y no lo estamos emitiendo.
    //El listener no es llamado ahora sino cuanod el evento "myEvent" sea emitido
     eventsEmitter.on("myEvent", function(){
       console.log("Esto saldrá antes que el listener del myEvent de abajo");
    });
   }
});

//Lanza el "newListener" event
eventEmitter.on("myEvent", function() {
    //Los listeners para un evento están dentro de un array.
    //Cada vez que se añade un listener se añade a la cola de dicho array.
    //Cuando el evento es emitido, node va ejecutando los listeners de arriba 
    //a abajo.
    //El listener del evento "newListener" es ejectuado antes 
    //de que se añada este listener a myEvents por lo que el listener añadido a
    //myEvents anteriormente es añadido antes que este listener
   console.log("Apareceré más abajo");
});        
eventEmmiter.emit("myEvent");
```
-removeListener: Evento que se lanza cada vez que se elimina un listener. Devuelve event(string) y listener(func).
    
    
# Buffers
Javascript tiene problemas para tratar datos binarios que le van llegando, por ejemplo, desde una conexión TCP. Con dichas conexiones, la información que se trata es raw, es decir, streams(o flujo) de datos binarios. Para tratar la información con facildad en javascript, hay que transformar dichos datos binarios en codificación unicode(utf8 entre otros). Cada caracter en utf8 viene codificado de una serie de 8 bits. Por lo tanto, lo que se suele hacer es guardar los binarios en sus octetos correspondiendes y codificarlos. Para guardar los bits hasta que el octeto esté completo, se hace uso de buffers que es una región de memoria encargada de guardar datos temporarmente mientras se pasa de un lado(TCP stream) a otro (funciones en javascript). Dicho buffer en Node actua como un array de dimensión dada. Cada elemento de dicho array contiene un octeto.

Para crear el buffer:
```
//buffer formado por un array de dimensión 10
//Este modo crea el array con los buffer sin inicializar
var buf = new buffer(10);
```
Otro método viene dado por
```
//buffer incialziado con un array
var buf = new buffer([10, 20, 15, 30]);
```
Otro método es crear un buffer a través de un string y su codificación. Este método por tanto, transforma dicho string en un array de octetos binario correspondiendes a la codificación dada:
```
//El encoding es opcional ya que por defecto se asume utf-8
var buf = new buffer("Hello World", "utf8");
```

Para poder escribir sobre el buffer:
```
//creamos un buffer con capacidad de 256 octetos(correspodientes a 256 caracteres en utf8)
var buf = new buffer(256);
```
write(str, [codificación]) codifica el string a utf8 o la encodación dada(si es que es dada). Graba solo los primeros 256 carácteres. Devuelve el número de octetos escritos

```
var len = buf.write("Hola mundo");
```
    
Para poder leer desde el buffer:
```
//Creamos un buffer desde un string
var buf = new buffer("hola mundo");
//Para leer usamos toString([codificación || "utf8"], [beg], [end]);
console.log(buf.toString()); //hola mundo
console.log(buf.toString("utf8", 1)); //ola mundo
console.log(buf.toString(undefined, 1, 6)); //ola m
```

Concatenar buffers:
```
var buf1 = new Buffer("Hola ");
var buf2 = new Buffer("Mundo!");

//Buffer.concat(lista_de_buffers, [longTotalDelNuevoBufferCreado])
var buf3 = Buffer.concat(buf1, buf2);
console.log(buf3.toString());   //Hola Mundo!
```

Comparar buffers:
    Compara por ordén el texto de dos buffers(en utf8 cod) ABC > ab8; ba < AB ya que el cod utf8 de las letras minusculas es menor que el de las mayusculas:

```    
var buf1 = new Buffer("Hola");
var buf2 = new Buffer("tola");
var buf3 = new Buffer("hola");
var buf4 = new Buffer("Hol");
var buf5 = new Buffer("Hol");

//Por orden buf3 < buf2 < buf4 == buf5 < buf1
//buf1.compare(buf2) devuelve -1 si buf1 < buf2, 0 si buf1 === buf2, 1 si buf1 > buf2
console.log(buf4.compare(buf1)); // -1
console.log(buf4.compare(buf2)); // 1
console.log(buf4.compare(buf5)); // 0
```

Copiar buffer:
```
//Copia sourceBuf desde la pos sourceStart hasta sourceEnd en targetBuf a partir de su pos targetStart
//Modifica targetBuf. No devuelve nada
//sourceBuf.copy(targetBuf,[targetStart], [sourceStart], [sourceEnd]);
sourceBuf.copy(targetBuf);
```

Slice(Devolve un sub-buffer):
```
//Devuelve un nuevo buffer formado de extraer(sin modificar) parte de un buffer:
// buf.slice([start], [end]);
var subBuf = buf.slice();//Devuelve todo
var subBuf2 = buf.slice(2,4);
```

Buf length: buf.length

Otros métodos importantes:

* buf.fill(value, [beg], [end]);
··· Rellena un buffer desde beg hasta end con el valor value: buf.fill(0) es usado cuando se ha creado buf con new Buffer(10), para rellenar los 10 elementos con 0 en vez de el aleatorio con el que son comenzados.

* Metodos de clase Buffer:
··· Buffer.isEncoding(enc)

Nos dice si enc es un tipo de encoding:
```
    Buffer.isEncoding("utf8") //true
    Buffer.isEncoding("utf-8") //true
    Buffer.isEncoding("utf/8") //false
``` 

··· Buffer.isBuffer(obj)
···· Nos dice si obj es un objeto buffer.
··· Buffer.byteLength(str, [encoding])
···· Nos dice el número de byts usados para str en la encodiacion [encoding || "utf8"]

# 05 Streams!!

Dentro de Node, podemos recibir y escribir datos de muchas fuentes distintas. Sease de conexiones HTTP, de TCPs, de archivos, etc. Cada uno de estos es un stream que genera un flujo de datos. Node nos permite trabajar sobre dicho flujo sin esperar a concentrarlo todo.

Los streams pueden ser:
* Readable: de lectura
* Writeble: de escritura
* Duplex: de escritura/lectura
* Transform: un duplex en el que el output depende del input

Cada stream es un eventEmitter por lo que lanzan eventos. Los eventos que se lanzan son:
* data: Es lanzado cuando hay datos disponibles para lectura
* end: Es lanzado cuando no hay más datos de lectura en el stream
* error: Es lanzado cuando ha habido un error en la lectura o escritura
* finish: Es lanzado cuando todos los datos se han enviado ya

Lectura:
```
//readSt.js
//Vamos a crear un stream a partir de la lectura
// de un archivo existente en el directoorio llamado readMyStream.txt

//Requerimos del modulo de lectura de archivos
var fs = require("fs");

//Contendrá los datos que vayamos leyendo
var data = "";
    
//Creamos un stream desde el que podremos leer:
var readerStream = fs.createReadStream("readMyStream.txt");

//Designamos el encoding para dicho texto:
readerStream.setEncoding("utf8");

//Asignamos un listener a dicho stream para cuando llegan datos
//Los datos van llegando en cachos desde el buffer
readerStream.on("data", function(chunkOfData) {
    data += chuckOfData;
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
```

Escritura:
```
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
``` 

Piping:
* Un modo eficiente para tratar con stream es el método de piping en el que se concatenan distintos streams de modo que el output de uno de ellos es el input del siguiente. De este modo podemos ir leyendo un stream y pasar los chucks a un stream de escritura que los va escribiendo. También podemos poner un pipe en medio que modifique el primer pipe antes de pasarlo al de escritura.
```
//piping.js
//Leemeos desde readMyStream.txt y escribimos en writtedWithPipe.txt
//Requerimos fs para lectura escritura de datos
var fs = require("fs");

//Stream de lectura desde readMyStream.txt
var readStream = fs.createReadStream("readMyStream.txt");

//Stream de escritura en writtedWithPipe.txt
var writeStream = fs.createWriteStream("writtedWithPipe.txt");

//Escribir en write lo que leemos en read
readStream.pipe(writeStream);
```

Compressing data:
    A través del mismo metodo de piping, podemos usar entre medias entre el stream de lectura y el de escritura una función que comprima.
    Para ello usaremos el módulo in-built zlib que comprime archivos a través de la función createGzip() en formato gz
```    
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
```

Uncompressing data:
    Efecto contrario
```
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
```
              
___
#06 FIles(fs)

###Leer archivos
    Para leer archivos de forma asincona usamos la función readFile:

```
//readfile.js

//Leemos el archivo text.txt y lo enviamos a la consola una vez completada.

//Module for working with files
var fs = require("fs");

//Async reading of files. readFile(path, callback).
//Callback receives err and data as input
fs.readFile("text.txt", function(err, data){
    if(err){
        return console.error(err);
    }
    //Data es un buffer por lo que hay transformarlo.
    //Encoding default utf8
    console.log("Los datos del archivo text.txt:");
    console.log(data.toString());
    console.log("Fin datos");
});
```
###Abrir un archivo:
```
    fs.open(path, flags, [mode], callback)
```
        Donde:
            path: archivo a tratar. Si estamos en escritura y el archivo no existe, se crea
            flags: como se abre el archivo:
                r: lectura. Excepción si no existe archivo
                r+: lectura y escritura. Crea una excepción si el archivo no existe
                rs: lectura sincrona
                rs+: lectura y escritura sincrona
                w: escritura. Crea archivo si no existe
                w+: escritura y lectura
                wx, wx+: como w y w+ solo que dan error si el archivo existe
                a: creado para appending
                    ax
                    a+: lectura y appending
            mode: Para casos en los que se crea un archivo, en mode se designa el tipo de privilegios que se le otroga. Por defecto 0666
            callback: recibe error y fd. fd es un numero que identifica al stream y que permite luego cerrarlo.
```                
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
```  
###Obtener datos de un archivo:
```
    fs.stat(path, callback)
```
        Donde:
            callback recibe err y stats
                donde stats es un objeto con los siguientes métodos:
                    stats.isFile()
                    stats.isDirectory()
                    stats.isBlockDevice()
                    stats.isCharacterDevice()
                    stats.isSimbolicDevice()
                    stats.isFifo()
                    stats.isSocket()
```       
//checkFile.js
//check file
//Modulo fs para trabajar con arcivos
var fs = require("fs");

//Fs.stat(path, callback)
fs.stat("text.txt", function(err, stats){
    //En caso de error
    if(err){
        return console.error(err);
    }
    //En caso de no error. stats es un objeto:
    console.log(stats); //Objeto stats
    console.log(stats.isFile()); //true
    console.log(stats.isDirectory()); //false
});
```

###Escribir en un archivo:
```
fs.writeFile(path, data[, options], callback)
```
            En options es un objeto que podemos pasarle con los keys:
                encoding (utf8 por defecto)
                mode (0666 por defecto)
                flag (w por defecto)
            El callback recibe como inputs err
```
//writeFile.js
//Escribir con node
//Modulo fs para tratar con archivos
var fs = require("fs");

//fs.writefile(path, data[, options], callback)
    //Options obj con claves {encoding , mode, flags}
    //callback con input err
fs.writeFile(   "writetext.txt", 
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
```
###Lectura más avanzada
    Otro metodo de lectura más avanzada es el de fs.read(fd, buffer, offset, length, position, callback)
    Donde:
            fd - This is the file descriptor returned by file fs.open() method.
            buffer - This is the buffer that the data will be written to.
            offset - This is the offset in the buffer to start writing at.
            length - This is an integer specifying the number of bytes to read.
            position - This is an integer specifying where to begin reading from in the file. If position is null, data will be read from the current file position.
            callback - This is the callback function which gets the three arguments, (err, bytesRead, buffer).
    
```
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
        //Los datos están en el buffer
        //Puede que haya parte del buffer que no ha sido ocupado(como por ejemplo cuando la long es menor que el buf.length)
        //En dicho caso, los elementos adicionale contienen basura.
        //BytesRead nos da el número de bytes leidos:
        console.log(buf.slice(0, bytesRead).toString());
        console.log("Archivo leido");
    });
});
```
###Cerrar archivos.
Una vez acabado la lectura y cuando no se vaya a usar más el archivo, es conveniente cerrarlo:
```
    fs.close(fd, callback(err))
```

###Truncar archivos
Con Truncar archivos estamos pasando a la función ftruncate una longitud de bytes. Eso hace que el archivo abierto y asociado a ftruncate será modificado para que ocupe dicho número de bytes. los que le sobren serán borrados, si le faltan, se le añadiran \0 (nulo en utf8):
```
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
```


###Eliminar archivos
Se usa:
```
fs.unling(path, callback);
```
Donde callback solo recibe error como argumento

###Crear Carpeta
Se usa:
```
fs.mkdir(path[, mode], callback)
```
Donde path incluye también el nombre de la carpeta  
Mode es el código del privilegio de acceso que se le quiere dar
Callback recibe solo err

###Leer nombres de archivos y directorios en una carpeta
```
fs.readdir(path, callback);
```
Donde callback recibe err y files como argumentos, donde files es un array con todos los nombres de los archivos y directorios

```
//readdir.js
//Leeremos todos los archivos y carpetas en la carpeta actual

//Modulo fs para trabajar con archivos y carpteas
var fs = require("fs");
//Emitter for when we have finished with reading the dir
var events = require("events");

//Carpeta actual
var path = "./";

//Event Emitter
var eventEmitter = new events.EventEmitter();

console.log("_________________");
console.log("Archivos y carpetas en este directorio");
console.log("_________________");

//Arrays that will contain files name and dir names on this folder
var filesCollection = [];
var dirCollecton = [];
var filesAnalyzed = 0;

//Reading folder!
fs.readdir(path, function(err, files){
    if(err) return console.log(err);
    /*  Files is an array that contains all the names of files and folders
        in the directory.
        It doesn't differenciate the files from the folders
        Para separarlo, vamos a usar el módulo stats visto anteriormente
        el cual contiene dos módulos, isFile() e isDirectory() que nos hacen la separación
        El problema de este método es que es asincrono por lo que cuando se ejecutan dichas 
        funciones, la variable i de abajo es igual a files.length para todos los casos.
        Eso hace que filename = files[i] sea siempre el último archivo de files
        Para solucionar ello, estamos haciendo un Inmediate Invocked Function Expression(IIFE)
        en el que creamos un closure al rededor de cada file.stat. De modo, cada closure es única
        para cada llamada y la variable j es igual al i correcto para cada caso ya que es llamado
        en el momento y no de forma asincrona

        Cuando estamos en el último caso, emitimos el evento de "finished_reading_dir" que muestra todas 
        las variables. En vez de la llamada, podiamos haber hecho la llamada a dirColl y fileColl desde 
        dicho if pero estamos usando todo lo que sabemos
        
    */
    for(var i = 0; i<files.length; i++){
        //Stats tells us if it is a file or a dir
        (function(j){
            //esta función es llamada inmediatamente. Crea una closure donde j es igual al 
            //valor de i correcto de modo que podemos acceder al valor correcto del nombre
            var filename = files[j];
            fs.stat(path+filename, function(err, stats){
                if(stats.isFile()){
                    filesCollection.push(path+filename);
                }
                if(stats.isDirectory()){
                    dirCollecton.push(path+filename);
                }
                //Cuenta el número de archivos que han sido categorizados en dir o file
                filesAnalyzed ++;
                //En el caso de todos los files hayan sido analizados
                if(filesAnalyzed == files.length){
                    eventEmitter.emit("finished_reading_dir");
                }
            });
        }(i));  
    }
});

eventEmitter.on("finished_reading_dir", function() {
    console.log("Carpetas:\n");
    dirCollecton.forEach(function(dirName){
        console.log(dirName);
    });
    console.log("\n Archivos:")
    filesCollection.forEach(function(fileName){
        console.log(fileName);
    });
});
```

###Eliminar directorio
```
fs.rmdir(path, callback)
```
Donde callback recibe err

###Añadir texto a un archivo
Con el metodo de writeFile visto anteriormente, cada vez que escribimos sobre un archivo, todo lo que tenía es borrado. 
Para añadir texto al final del archivo sin borrar lo anterior usamos appendFile:
````
    fs.appendFile(path, data [, options], callback)
````
Donde:
* Data es el texto que añadiremos
* Options es un objeto con claves "encoding", "mode", "flags"
* Callback recibe solo error
```
//appendData.js
//Cada vez que se llama a este archivo, 
//añade al final del texto la fecha a la que se hizo
//Modulo fs para tratar con archivos
var fs = require("fs");

var filepath = "appending.txt";

//Tiempo actual más salto de linea
var textToAppend = Date() + "\r\n";

//appendFile, añade textToAppend al final del archivo filepath
fs.appendFile(filepath, textToAppend, function(err) {
    if(err) return console.log(err);
    console.log("Fecha Añadida!");
});
```


###Otros métodos interesantes
Todos asincronos a no ser que diga sync
```
fs.rename(oldPath, newPath, callback)
fs.chmod(path, mode, callback)
    Cambia el modo de privilegio
fs.link(srcpath, dstpath, callback)
fs.watchFile(filename[, options], listener)
    Listener que se activa cada vez que filename cambia
fs.unwatchFile(filename[, listener])
fs.exists(path, callback)
```

Más en este [enlace](http://www.tutorialspoint.com/nodejs/nodejs_file_system.htm)