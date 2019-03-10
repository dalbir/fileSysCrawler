const express = require('express')
const klawSync = require('klaw-sync')
const fetch = require('node-fetch')
const Tesseract = require('tesseract.js')
const PDFJS = require('pdfjs-dist')
const FormData = require('form-data')       //create form-data
const fs = require('fs')                    //fileSream read
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

// console.log(filesList);
// console.log(dirsList);

// for (var i = 2; i < 5; i++) {
//     var mFileData = fs.readFileSync(filesList[i], 'utf-8').toString();
//     console.log(mFileData + "\n\n\n\n\n\n");
// }

//console.log(filesList[1].split('/').pop());


// API Handler to get file data based on the query domain


function gettext(pdfUrl){
    var pdf = PDFJS.getDocument(pdfUrl);
    return pdf.then(function(pdf) { // get all pages text
        var maxPages = pdf.pdfInfo.numPages;
        var countPromises = []; // collecting all page promises
        for (var j = 1; j <= maxPages; j++) {
            var page = pdf.getPage(j);

            var txt = "";
            countPromises.push(page.then(function(page) { // add page promise
                var textContent = page.getTextContent();
                return textContent.then(function(text){ // return content promise
                    return text.items.map(function (s) { return s.str; }).join(''); // value page text 

                });
            }));
        }
        // Wait for all pages and join text
        return Promise.all(countPromises).then(function (texts) {
        
            return texts.join('');
        });
    });
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

    res.send(filesList);
})

app.get("/getDirsList", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for directory names");

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
/*
app.post("/readPDFFile", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("request from client for image data of " + req.body.path);

    gettext(req.body.path)
    .then(function (text) {
        console.log('parse ' + text);
    }, function (reason) {
        console.error(reason);
    })
    .finally(result => res.send(result));
})
*/

//Server listening at port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))