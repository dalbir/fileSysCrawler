# fileSysCrawler


This is a repository with a built in crawler and REST API interface for interacting with file system for the user-defined location.

## Features!

  - File System Crawler for user-defined location
  - Extract text data from most UTF-8 encoded files, such as .txt, .md, .config, .xml, .html, .js, etc.
  - Extract text data from pdf files
  - Extract text from image files by performing OCR on them

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

#### To get text from text based files

```sh
fileSysCrawler.readTextFile("<enter file location>")

#eg. relative path
fileSysCrawler.readTextFile("files/abc.txt");


# the text data gets stored in myTextFileData
fileSysCrawler.myTextFileData

#eg. to console log
console.log(fileSysCrawler.myTextFileData)
```

#### To get text from image files (perform OCR)

```sh
fileSysCrawler.readImageFile("<enter file location>")

#eg. relative path
fileSysCrawler.readImageFile("files/abc.jpg");


# the text data gets stored in myImageFileData
fileSysCrawler.myImageFileData

#eg. to console log
console.log(fileSysCrawler.myImageFileData)
```

#### To get text from pdf files

```sh
fileSysCrawler.readPDFFile("<enter file location>")

#eg. relative path
fileSysCrawler.readPDFFile("files/abc.pdf");


# the text data gets stored in myPDFFileData
fileSysCrawler.myPDFFileData

#eg. to console log
console.log(fileSysCrawler.myPDFFileData)
```

### To activate REST API Interface
```sh
fileSysCrawler.initiateREST();
```

## Usage as separate package with REST API interfaces

1. Clone the repository on your file system
2. Open terminal/cmd and go to the repository
3. Run **"npm i"** and wait for the dependent repositories to get installed
4. Edit **fileSysCrawler.js** and add **"initiateREST();"** command at the end of the file
5. run **"node index.js"** to start the crawler


### REST API interface definitions
- Program starts running at port 3001 by default.
- Perform /setCrawlLocation before any other /getFilesList or /getDirsList

| Verb | API | Body |
| ------ | ------ | ------ |
| POST | /setCrawlLocation | "path"
| GET | /getFilesList | 
| GET | /getDirsList | 
| POST | /readTextFile | "path"
| POST | /readImageFile | "path"
| POST | /readPDFFile | "path"


License
----

MIT


**Free Software, Hell Yeah!**
