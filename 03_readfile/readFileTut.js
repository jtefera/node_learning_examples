//To create a server if needed
var http = require("http");

//TO read and write files
var fs = require("fs");

//Async function to read files,
//Path to file, func for err and data
fs.readFile("index.txt", function(err, data){
    if(err) return console.log(err);
    console.log(data.toString());
});

//ProgramEnded