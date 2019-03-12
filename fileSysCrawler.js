const express = require('express')
const klawSync = require('klaw-sync')
const pdf = require('pdf-parse');           // pdf parse
const Tesseract = require('tesseract.js')
const fs = require('fs')                    // fileSream read
const app = express()


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var crawlLocation = "files/";
var filesList = [];
var dirsList = [];

function crawl(location) {
    files = klawSync(location, {nodir: true});
    dirs = klawSync(location, {nofile: true});
    
    
    for (var i = 0; i < files.length; i++) {
        filesList.push(files[i].path);
    }
    
    for (var i = 0; i < dirs.length; i++) {
        dirsList.push(dirs[i].path);
    }
}

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

var myTextFileData = "";

async function readTextFile(location) {
    myTextFileData = await fs.readFileSync(location, 'utf-8').toString();
    return myTextFileData;
}

app.post("/readTextFile", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for file data of " + req.body.path);

    res.send(readTextFile(req.body.path));
})

var myImageFileData = "";

async function readImageFile(location) {
    return Tesseract.recognize(location)
    .progress(message => console.log(message))
    .catch(err => console.error(err))
    .then(result => console.log(result.text))
    .finally((result) => {myImageFileData = result.text})
}

app.post("/readImageFile", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for image data of " + req.body.path);
    
    readImageFile(req.body.path).then(() => {
        res.send(myImageFileData);
    })
})

var myPDFFileData = "";

async function readPDFFile(location) {
    var dataBuffer = fs.readFileSync(location);
 
    return pdf(dataBuffer).then(async function(data) {
    
        // // number of pages
        // await console.log(data.numpages);
        // // number of rendered pages
        // await console.log(data.numrender);
        // // PDF info
        // await console.log(data.info);
        // // PDF metadata
        // await console.log(data.metadata); 
        // // PDF.js version
        // // check https://mozilla.github.io/pdf.js/getting_started/
        // await console.log(data.version);
        // // PDF text
        // await console.log(data.text); 
        
        myPDFFileData = await data.text;
    });
}

app.post("/readPDFFile", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for text data of pdf file: " + req.body.path);

    readPDFFile(req.body.path).then(() => {
        res.send(myPDFFileData);
    })
})

var RESTPortNumber = 3000;

function initiateREST() {
    //Server listening at port 3001
    app.listen(RESTPortNumber, () => console.log(`Example app listening on port ${RESTPortNumber}!`));
}

module.exports = {
    crawlLocation,
    crawl,
    filesList,
    dirsList,
    readTextFile,
    readImageFile,
    readPDFFile,
    RESTPortNumber,
    initiateREST,
    myImageFileData,
    myPDFFileData,
    myTextFileData
}