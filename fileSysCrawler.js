const express = require('express')
const klawSync = require('klaw-sync')
const anyFileParser = require('anyfileparser')
const app = express()


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var crawlLocation = "/";
var filesList = [];
var dirsList = [];

function crawl(location) {
    files = klawSync(location, {nodir: true});
    dirs = klawSync(location, {nofile: true});
    
    filesList = [];
    dirsList = []; 
    for (var i = 0; i < files.length; i++) {
        filesList.push(files[i].path);
    }
    
    for (var i = 0; i < dirs.length; i++) {
        dirsList.push(dirs[i].path);
    }
}

function parseFile(filename, callback) {
    anyFileParser.parseFile(filename, function (data) {
        callback(data);
    })
}

app.get("/getCrawlLocation", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client to get crawl locations");

    res.send(crawlLocation);
})

app.post("/setCrawlLocation", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client to set crawl locations");

    crawlLocation = req.body.crawlLocation;
    await crawl(crawlLocation);
    res.send(`Success. New crawl location set to ${crawlLocation}`);
})

    
app.get("/getFilesList", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for file names");

    await crawl(crawlLocation);
    res.send(filesList);
})

app.get("/getDirsList", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for directory names");

    await crawl(crawlLocation);
    res.send(dirsList);
})


app.post("/parseFile", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for text data of pdf file: " + req.body.path);

    anyFileParser.parseFile(req.body.path, function (data) {
        var myJSON = {
            "data": data
        }
        res.send(myJSON);
    })
})


//////   CHANGE REST PORT NUMBER BELOW

var RESTPortNumber = 3000;

//////   CHANGE REST PORT NUMBER ABOVE

// function initiateREST() {
    app.listen(RESTPortNumber, () => console.log(`File Sys Crawler listening on port ${RESTPortNumber}!`));
// }

module.exports = {
    crawlLocation,
    crawl,
    filesList,
    dirsList,
    parseFile,
    // initiateREST
}