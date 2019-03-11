const express = require('express')
const klawSync = require('klaw-sync')
const fetch = require('node-fetch')
const pdf = require('pdf-parse');           // pdf parse
const Tesseract = require('tesseract.js')
const FormData = require('form-data')       // create form-data
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

crawl(crawlLocation);

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

app.post("/readTextFile", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for file data of " + req.body.path);

    var myFileData = await fs.readFileSync(req.body.path, 'utf-8').toString();

    res.send(myFileData);
})

app.post("/readImageFile", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for image data of " + req.body.path);

    Tesseract.recognize(req.body.path)
    .progress(message => console.log(message))
    .catch(err => console.error(err))
    .then(result => console.log(result.text))
    .finally(result => res.send(result.text))
})

app.post("/readPDFFile", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for image data of " + req.body.path);

    var dataBuffer = fs.readFileSync(req.body.path);
 
    pdf(dataBuffer).then(async function(data) {
    
        // number of pages
        await console.log(data.numpages);
        // number of rendered pages
        await console.log(data.numrender);
        // PDF info
        await console.log(data.info);
        // PDF metadata
        await console.log(data.metadata); 
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        await console.log(data.version);
        // PDF text
        await console.log(data.text); 
        
        res.send(data.text);
    });
})


//Server listening at port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))