
/// Express.js scripts have 4 main sections, called handles
/// (1) Calls the express.js parent library + all other modules
var express = require("express");
var path = require("path");
//loads bodyParser module, which reads the submitted form and extracts specified values
var bodyParser = require("body-parser");
// stores specified values using comma seperated variables
//initiates yacsv module which helps read csv/database files
var csv = require('ya-csv');

var app = express()
// asks bodyParser to read all requests and attach form data to the request (name, email, score) object
app.use(express.static(path.join(__dirname, "")));
app.use(bodyParser.urlencoded({extended:true}));
/// (2a) GET
//Specifies URL in app.js
app.get("/", function(request, response){
    response.sendFile(path.join(__dirname, "pages/index.html"));
});
/// (3) POST
/*When LISTEN detects completion of HTML form, POST activates anonymous function which
posts data to index.html/score by creating a 3 column csv array*/
app.post('/score', function(request, response){
    var name = request.body.fullName;
    var email = request.body.email;
    var score = request.body.score;

    var database = csv.createCsvFileWriter("scores.csv", {"flags": "a"});
    var data = [name, email, score];

    database.writeRecord(data);
    database.writeStream.end();

    response.send("Thanks " + name + ", your score has been recorded!");
});
/// (2b) GET
/*When LISTEN detects a request for data object, GET activates anonymous function which
 creates an array of receieved scores to display on console*/
app.get("/score", function(request, response) {
    var reader = csv.createCsvFileReader("scores.csv");
    reader.setColumnNames(['name', 'email', 'score']);

    var scores = [];
    reader.addListener('data', function(data) {
        scores.push(data);
    });

    reader.addListener('end', function(){
        response.send(scores);
    })
});
/// (4) LISTEN
//Initiates LISTEN function of express.js - continuously monitoring traffic for any GET or POST requests
var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Bob's Flappy Bird listening at http://%s:%s", host, port);
});
