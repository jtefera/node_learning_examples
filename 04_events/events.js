//Require events, in-build with node, no need to install
var events = require("events");
//Require HTTP for server purposes
var http = require("http");

//Creating the event emmiter object. It handles all the events
var eventEmitter = new events.EventEmitter();

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
}).listen(8081);

// Ejemplos de newListener y once
//Lanzado una vez cuando un evento es enviado(con on o addListener, no es lo mismo que emit)
eventEmitter.once("newListener", function(event, listenr){
    //Vamos a añadir un nuevo listener al evento myEvent
   if(event == "myEvent") {
    //Solo estamos haciendo un binding y no lo estamos emitiendo.
    //El listener no es llamado ahora sino cuanod el evento "myEvent" sea emitido
     eventEmitter.on("myEvent", function(){
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
        
eventEmitter.emit("myEvent");