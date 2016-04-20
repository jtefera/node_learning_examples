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