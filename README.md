# File System Crawler


This is a file system crawler with REST API interface for interacting with file system for any user-defined location.

## Features!

  - File System Crawler for user-defined location
  - Extract text data from most UTF-8 encoded files, such as .txt, .md, .config, .xml, .html, .js, etc.
  - Extract text data from pdf files
  - Extract text from image files by performing OCR on them
  - Extract text data from office files, such as .docx, .pptx, .xlsx, .odt, .odp, .ods
  - Set location for decompressing office files in places with restricted write access for nodeJS

**Scroll below to find instructions to use it as a separate package (non-npm) with REST API interface**


## Usage as npm package
```sh
npm i filesyscrawler
```
#### To import this repository to your project

```sh
const fileSysCrawler = require("filesyscrawler");
```

#### To set crawl location
```sh
fileSysCrawler.crawlLocation = "<set desired crawl location>";

#eg. full path (for windows, use two "\" for folder heirarchy)
fileSysCrawler.crawlLocation = "C:\\Users\\guest\\Desktop";

#eg. relative path
fileSysCrawler.crawlLocation = "/files";
```

#### To perform crawl
```sh
fileSysCrawler.crawl();
```

#### After crawling, all the file names (no directories) in the crawl location are stored in filesList
```sh
fileSysCrawler.filesList

#eg. to console log
console.log(fileSysCrawler.filesList)
```

#### After crawling, all the directory names (no files) in the crawl location are stored in dirsList

```sh
fileSysCrawler.dirsList

#eg. to console log
console.log(fileSysCrawler.dirsList)
```

#### To get text from any file

```sh
fileSysCrawler.parseFile("/path/to/file", function(data){
	// "data" string in the callback here is the text parsed from the file passed in the first argument above
	console.log(data)
})

#Eg. Absolute Path
fileSysCrawler.parseFile("C:\\Users\\Harsh\\files\\abcd.docx", function(data){
	// "data" string in the callback here is the text parsed from the file passed in the first argument above
	console.log(data)
})

#Optionally change decompression location for office Files at persionalised locations for environments with restricted write access

// Put this file before parseOffice method to take effect.
fileSysCrawler.setDecompressionLocation("/tmp");  // New decompression location would be "/tmp/officeDist"

// P.S.: Setting location on a Windows environment with '\' heirarchy requires to be entered twice '\\'
fileSysCrawler.setDecompressionLocation("C:\\tmp");  // New decompression location would be "C:\tmp\officeDist"

#Eg. Relative Path
fileSysCrawler.parseFile("files/xyzd.jpg", function(data){
	// "data" string in the callback here is the text parsed from the file passed in the first argument above
	console.log(data)
})

```

#### To activate REST API Interface
```sh
fileSysCrawler.initiateREST();
```

#### The default REST API port number is 3000
```sh
#in case port 3000 (the default port) is in use, you can set the port number manually before initiating REST API interface above
fileSysCrawler.RESTPortNumber = <port number>
#eg. to set to port number 8080
fileSysCrawler.RESTPortNumber = 8080
```

## Usage as separate package with REST API interfaces

1. Clone the repository on your file system
2. Open terminal/cmd and go to the repository
3. Run **"npm i"** and wait for the dependent repositories to get installed
4. Edit **fileSysCrawler.js** and add **"initiateREST();"** command at the end of the file
5. run **"node fileSysCrawler.js"** to start the crawler


### REST API interface definitions
- Program starts running at port 3000 by default.
- Perform /setCrawlLocation before any other /getFilesList or /getDirsList

| Verb | API | Body |
| ------ | ------ | ------ |
| POST | /setCrawlLocation | "path"
| GET | /getFilesList | 
| GET | /getCrawlLocation | 
| GET | /getDirsList | 
| POST | /parseFile | "path"


### Example
#### 1. Set Crawl Location

REQUEST

```sh
POST http://localhost:3000/setCrawlLocation 

body
{
	"crawlLocation": "files/"
}
```

RESPONSE

```sh
Success. New crawl location set to files/
```

#### 2. Get Files List
REQUEST

```sh
GET http://localhost:3000/getFilesList
```

RESPONSE

```sh
[
    "C:\\Users\\Harsh\\files\\abcd.docx",
	"C:\\Users\\Harsh\\files\\xyzd.png"
]
```

#### 3. Parse file
REQUEST

```sh
POST http://localhost:3000/parseFile

body
{
	"path":  "C:\\Users\\Harsh\\files\\abcd.docx"
}

```

RESPONSE

```sh
{
    "data": "This is a sample document made to parse text from"
}
```

License
----

MIT


**Free Software, Hell Yeah!**
