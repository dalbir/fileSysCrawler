//Router Express Server at port 3000 used to transfer API request to tackle CORS errors

//Get today's date
function getTodayDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd = '0'+dd
    } 
    
    if(mm<10) {
        mm = '0'+mm
    } 
    
    today = yyyy + '-' + mm + '-' + dd;
    return today
}


const express = require('express')
const klawSync = require('klaw-sync')
const fetch = require('node-fetch')
const Tesseract = require('tesseract.js')
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



const files = klawSync('files/', {nodir: true});
const dirs = klawSync('files/', {nofile: true});

var filesList = [];
var dirsList = [];

for (var i = 0; i < files.length; i++) {
    filesList.push(files[i].path);
}

for (var i = 0; i < dirs.length; i++) {
    dirsList.push(dirs[i].path);
}

// console.log(filesList);
// console.log(dirsList);

// for (var i = 2; i < 5; i++) {
//     var mFileData = fs.readFileSync(filesList[i], 'utf-8').toString();
//     console.log(mFileData + "\n\n\n\n\n\n");
// }

//console.log(filesList[1].split('/').pop());


// API Handler to get file data based on the query domain

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

//Server listening at port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))