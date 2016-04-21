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
	/*	Files is an array that contains all the names of files and folders
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

