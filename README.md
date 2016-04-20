BASIC NOTES ON NODE.JS / SPANGLISH
***

#01 Basic: Iniciar un servidor básico:

'''
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
'''

'''
//En terminal
node server.js
'''

#02 Basic Modules: Iniciar un paquete en npm
'''
//en terminal
npm init

//Rellenar datos que pediran

//Tras rellendado datos, añadirnos como usuarios
npm adduser
//Pedira username, contraseña y email

//Publicar al repositiorio de modulos de npm. Si no va, comprobar que el nombre no está usado
npm publish
'''


# 03 ReadFile: Reading a file async

'''
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
'''


#04 Events
Node is an event driven language. We build multiple observers for different kinds of events and when one is emmited, the function adhered to the oberved is called. Events can be a client connection, a get request, a change in a state, etc. Node has also the ability to create its own events and fire them at please. For that it uses the events module:

'''
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
'''

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

'''
        //Lanzado una vez cuando un evento es enviado(con on o addListener, no es lo mismo que emit)
        eventsEmitter.once("newListener", function(event, listenr){
            //Vamos a añadir un nuevo listener al evento myEvent
           if(event == "myEvent") {
            //Solo estamos haciendo un binding y no lo estamos emitiendo.
            //El listener no es llamado ahora sino cuanod el evento "myEvent" sea emitido
             eventsEmitter.on("myEvent", function(){
               console.log("Hola! esto saldrá antes que el listener añadido al myEvent más abajo")
            });
           }
        });

        //Lanza el "newListener" event
        eventEmitter.on("myEvent", function() {
            //Los listeners para un evento están dentro de un array. Cada vez que se añade un listener se añade a la cola de dicho array.
            //Cuando el evento es emitido, node va ejecutando los listeners de arriba a abajo
            //El listener del evento "newListener" es ejectuado antes de que se añada este listener a myEvents por lo que el listener añadido a
            //myEvents anteriormente es añadido antes que este listener
           console.log("Apareceré más abajo");
        });
'''
        
        eventEmmiter.emit("myEvent");
    -removeListener: Evento que se lanza cada vez que se elimina un listener. Devuelve event(string) y listener(func).
    
    
____
Buffers
Javascript tiene problemas para tratar datos binarios que le van llegando, por ejemplo, desde una conexión TCP. Con dichas conexiones, la información que se trata es raw, es decir, streams(o flujo) de datos binarios. Para tratar la información con facildad en javascript, hay que transformar dichos datos binarios en codificación unicode(utf8 entre otros). Cada caracter en utf8 viene codificado de una serie de 8 bits. Por lo tanto, lo que se suele hacer es guardar los binarios en sus octetos correspondiendes y codificarlos. Para guardar los bits hasta que el octeto esté completo, se hace uso de buffers que es una región de memoria encargada de guardar datos temporarmente mientras se pasa de un lado(TCP stream) a otro (funciones en javascript). Dicho buffer en Node actua como un array de dimensión dada. Cada elemento de dicho array contiene un octeto.

Para crear el buffer:
    //buffer formado por un array de dimensión 10
    //Este modo crea el array con los buffer sin inicializar
    var buf = new buffer(10);

Otro método viene dado por
    //buffer incialziado con un array
    var buf = new buffer([10, 20, 15, 30]);

Otro método es crear un buffer a través de un string y su codificación. Este método por tanto, transforma dicho string en un array de octetos binario correspondiendes a la codificación dada:
    //El encoding es opcional ya que por defecto se asume utf-8
    var buf = new buffer("Hello World", "utf8");

Para poder escribir sobre el buffer:
    //creamos un buffer con capacidad de 256 octetos(correspodientes a 256 caracteres en utf8)
    var buf = new buffer(256);
    //write(str, [codificación]) codifica el string a utf8 o la encodación dada(si es que es dada). Graba solo los primeros 256 carácteres. Devuelve el número de octetos escritos
    var len = buf.write("Hola mundo");
    
Para poder leer desde el buffer:
    //Creamos un buffer desde un string
    var buf = new buffer("hola mundo");
    //Para leer usamos toString([codificación || "utf8"], [beg], [end]);
    console.log(buf.toString()); //hola mundo
    console.log(buf.toString("utf8", 1)); //ola mundo
    console.log(buf.toString(undefined, 1, 6)); //ola m

Concatenar buffers:
    var buf1 = new Buffer("Hola ");
    var buf2 = new Buffer("Mundo!");
    
    //Buffer.concat(lista_de_buffers, [longTotalDelNuevoBufferCreado])
    var buf3 = Buffer.concat(buf1, buf2);
    console.log(buf3.toString());   //Hola Mundo!

Comparar buffers:
    Compara por ordén el texto de dos buffers(en utf8 cod) ABC > ab8; ba < AB ya que el cod utf8 de las letras minusculas es menor que el de las mayusculas:
    
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

Copiar buffer:
    //Copia sourceBuf desde la pos sourceStart hasta sourceEnd en targetBuf a partir de su pos targetStart
    //Modifica targetBuf. No devuelve nada
    //sourceBuf.copy(targetBuf,[targetStart], [sourceStart], [sourceEnd]);
    sourceBuf.copy(targetBuf);

Slice(Devolve un sub-buffer):
    //Devuelve un nuevo buffer formado de extraer(sin modificar) parte de un buffer:
    // buf.slice([start], [end]);
    var subBuf = buf.slice();//Devuelve todo
    var subBuf2 = buf.slice(2,4);

Buf length: buf.length

Otros métodos importantes:
    buf.fill(value, [beg], [end]);
        Rellena un buffer desde beg hasta end con el valor value: buf.fill(0) es usado cuando se ha creado buf con new Buffer(10), para rellenar los 10 elementos con 0 en vez de el aleatorio con el que son comenzados.
    Metodos de clase Buffer:
        Buffer.isEncoding(enc)
            //Nos dice si enc es un tipo de encoding:
                Buffer.isEncoding("utf8") //true
                Buffer.isEncoding("utf-8") //true
                Buffer.isEncoding("utf/8") //false
        Buffer.isBuffer(obj)
            //Nos dice si obj es un objeto buffer.
        Buffer.byteLength(str, [encoding])
            //Nos dice el número de byts usados para str en la encodiacion [encoding || "utf8"]

-----
Streams!!

Dentro de Node, podemos recibir y escribir datos de muchas fuentes distintas. Sease de conexiones HTTP, de TCPs, de archivos, etc. Cada uno de estos es un stream que genera un flujo de datos. Node nos permite trabajar sobre dicho flujo sin esperar a concentrarlo todo.

Los streams pueden ser:
    Readable: de lectura
    Writeble: de escritura
    Duplex: de escritura/lectura
    Transform: un duplex en el que el output depende del input

Cada stream es un eventEmitter por lo que lanzan eventos. Los eventos que se lanzan son:
    data: Es lanzado cuando hay datos disponibles para lectura
    end: Es lanzado cuando no hay más datos de lectura en el stream
    error: Es lanzado cuando ha habido un error en la lectura o escritura
    finish: Es lanzado cuando todos los datos se han enviado ya

Lectura:
    //readSt.js
    //Vamos a crear un stream a partir de la lectura de un archivo existente en el directoorio llamado readMyStream.txt

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

Escritura:
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
    

Piping:
    Un modo eficiente para tratar con stream es el método de piping en el que se concatenan distintos streams de modo que el output de uno de ellos es el input del siguiente. De este modo podemos ir leyendo un stream y pasar los chucks a un stream de escritura que los va escribiendo. También podemos poner un pipe en medio que modifique el primer pipe antes de pasarlo al de escritura.
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
    
Compressing data:
    A través del mismo metodo de piping, podemos usar entre medias entre el stream de lectura y el de escritura una función que comprima.
    Para ello usaremos el módulo in-built zlib que comprime archivos a través de la función createGzip() en formato gz
    
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

Uncompressing data:
    Efecto contrario
    
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
              
___
FIles(fs)

Leer archivos
    Para leer archivos de forma asincona usamos la función readFile:
    
    //readfile.js
    //Leemos el archivo text.txt y lo enviamos a la consola una vez completada.
    //Module for working with files
    var fs = require("fs");
    
    //Async reading of files. readFile(path, callback). Callback receives err and data as input
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

 
    Abrir un archivo:
    fs.open(path, flags, [mode], callback)
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
  
    Obtener datos de un archivo:
    fs.stat(path, callback)
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

    Escribir en un archivo:
        fs.writeFile(path, data[, options], callback)
            En options es un objeto que podemos pasarle con los keys:
                encoding (utf8 por defecto)
                mode (0666 por defecto)
                flag (w por defecto)
            El callback recibe como inputs err
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
        
    

    Lectura más avanzada
    Otro metodo de lectura más avanzada es el de fs.read(fd, buffer, offset, length, position, callback)
    Donde:
            fd - This is the file descriptor returned by file fs.open() method.
            buffer - This is the buffer that the data will be written to.
            offset - This is the offset in the buffer to start writing at.
            length - This is an integer specifying the number of bytes to read.
            position - This is an integer specifying where to begin reading from in the file. If position is null, data will be read from the current file position.
            callback - This is the callback function which gets the three arguments, (err, bytesRead, buffer).
    
    
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

    Cerrar archivos.
    Una vez acabado la lectura y cuando no se vaya a usar más el archivo, es conveniente cerrarlo:
        fs.close(fd, callback(err))
        
        