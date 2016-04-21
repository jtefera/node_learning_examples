//httpserver.js
//Vamos a crear un server sencllo que devulve los archivos 
//que se buscan si existen y si no un 404

//Paara el server necesitamos HTTP, para la lectura de archivos fs
//url para tratar archivos
var http = require("http");
var fs = require("fs");
var url = require("url");

//Connection POrt
var portNumber = 8081;

//Called when a file is found. Return the html file
function readHTMLfile(pathname, res) {
	fs.readFile(pathname, function(err, data){
		if(err){
			return console.log("Error reading the file: ", err);
		}
		res.writeHead(200, {"Content-type":"text/html"});
		res.end(data.toString());
		console.log("Todo listo!");
	});
}

//Called when no file is found for a given pathname
function return404(res){
	//404 page
	res.writeHead(404, {"Content-type":"text/html"});
	res.end("We are Sorry but we could find the page you are searching");
}

//Creating HTTP server
http.createServer(function(req, res) {
	//Conection done!
	console.log("User connected.");
	//req.url= localhost:8081/pathname
	//url.pathname = /pathname
	//Solo queremos pathname
	var urlSearched = url.parse(req.url).pathname.substring(1) || "./";
	//Searching that file:
	//Check if is file or folder:
	try{
		//Throws an error if there is no file or directory on urlSearched path
		//Error will be taken on the catch part
		var statInfo = fs.statSync(urlSearched);
		//From here on, we have a file or directory for the urlSearched path 
		if(statInfo.isDirectory()){
			//Case pathname points to a directory
			//In that case the default files to read
			//are index.htm or index.html
			var indexPath = urlSearched + "index.htm";
			try{
				//Check if there is a index.htm in the directory
				//Throws an error if there is not an index.htm in the directory
				var indexStatInfo = fs.statSync(indexPath);
				//There is an index.htm
				//Return that file
				readHTMLfile(indexPath, res);
			} catch(err){
				//There is no index.htm in the directory.
				//Try with index.html
				indexPath += "l";
				try{
					//Check if there is a index.html in that directory
					var indexStatInfo = fs.statSync(indexPath);
					//If no error, there is a index.html file
					//Return that file
					readHTMLfile(indexPath, res);

				} catch(err) {
					console.log("There is no index.htm nor" 
								+ "index.html in the directory "
								+ urlSearched, err);
					//Give an 404 Error
					return404(res);
				}
			}
		} else if(statInfo.isFile()){
			//Case the url points to a file
			//Return that file
			readHTMLfile(urlSearched, res);
		} else {
			//In the strange case that the path points to something
			//but it is not a directory or a file ¿?
			//Return 404
			return404(res);
		}
	} catch(err){
		if(err.code === "ENOENT"){
			//ENOENT is the code for non found file or directory
			console.log("The path './" + urlSearched 
						+ "' doesn't point to a file nor to a directory");
		} else {
			//Other Errors
			console.log(err);
		}
		//Return the 404 Page
		return404(res);
	}
}).listen(portNumber);
