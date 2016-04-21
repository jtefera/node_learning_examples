// basicExample.js
//Ejemplo básico del funcionamiento de express
//Una vez iniciado el servidor, acceder a:
//  localhost:8080/
//  localhost:8080/heyy o cualquier otra cosa
//Ver difenccia en la consola. En el primero se verán las
//llamadas a log, indexMiddle y hello mientras que en el segundo
//solo a log ya que no hay enrutamiento definido para /heyy

//Express module for node
var express = require("express");

//Express object
var app = express();

//apiRouter funciona muy parecido a app solo que lo podemos
//pasar como un middleware
var apiRouter = express.Router();
//Port to listen for the server
var port = 8080;


//Se llamará al middleware para todo request al puerto
app.use(log);
//Cuando se hace un get request a la página de inicio,
//Se lanzan los middleware log y hello, definidos más abajo,
//uno tras otro
app.get("/", indexMiddle, hello);

//Asignar apiRouter a toda llamada a la carpeta /api
app.use("/api", apiRouter);

//Call the middleware to all path to which apiRouter is assigned:
// /api, /api/something/something 
apiRouter.use(weAreTheApi);


//Ejemplos de middleware
function log(req, res, next){
    //Lo que hará este middleware es que para cada conexión,
    //Escribirá en nuestra consola algunos datos del cliente
    //Como la fecha, el request method y la url a la que ha accedido
    
    console.log("Conexión hecha en: " + new Date());
    console.log("Se ha accedido a la url " + req.url 
                + " por medio de un metodo " + req.method);
                
    //Una vez acabado este middleware, pasamos al siguiente
    //Para ello, llamamos a la función next:
    
    next();
}

function indexMiddle(req, res, next) {
    //Llamado solo en el path ./
    console.log("Connected to the index page");
    //Pasamos a hello
    next();
}

function hello(req, res, next){
    //Enviá una página html al cliente 
    //con el téxto de "Hello World"
    
    //Enviamos el header.
        //Status: 200
        //Conexión: text/html
    res.writeHead(200, {"Conection-type": "text/html"});
    
    //Enviamos el texto y cerramos el stream de respuesta:
    res.end("Hello World! :)");
    
    //Llamamos al siguiente middleware si es que hay
    //En este caso, como es el último, es opcional ponerlo
    next();
}

function weAreTheApi(req, res, next) {
    console.log("We are in the Happy Api World");
    res.send("What is this??");
    //Starting the rendering! 
    //Status 200! All ok :)
    //Conection: html
    res.writeHead(200, {"Conection-type": "text/html"});
    //Path Called! This will be called on the apiRouter
    //The path will be from the api folder!!
    //Just a hello and the url to check the paradox
    //req.url for:
    //  /api -> /
    //  /api/something -> /something
    console.log(__dirname);

    res.write("Hello to the Api. You are in the url " + req.url);
    //Ending Conection!
    res.end();

    //Just in case. Not needed as it is the last middleware
    next();
}
//Empezamos el server!
app.listen(port, function(){
   console.log("Server Started!");
});