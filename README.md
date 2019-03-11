# fileSysCrawler

This is a repository with a built in crawler and REST API interface for interacting with file system for the set location.

To setup, 
1. clone the repository on your file system
2. open terminal/cmd and go to the repository
3. run "npm i" and wait for the dependent repositories to get installed
4. run "node index.js" to execute the crawler


By default,
crawling location is set at a folder "files" inside of the current repository.
To change the crawling location, edit the value of the variable "crawlLocation" or follow the API interfaces.

The program starts running at port 3000.

1. SET CRAWL LOCATION FOR THE APPLICATION TO OPERATE ON
- verb: POST 
- url: "localhost:3000/setCrawlLocation"
- body: {"path": "\\\enter path name"}

2. GET LIST OF FILES UNDER THE GIVEN FOLDER
- verb: GET
- url: "localhost:3000/getFilesList"

3. GET LIST OF DIRECTORIES UNDER THE GIVEN FOLDER
- verb: GET
- url: "localhost:3000/getDirsList"

4. READ TEXT FILE DATA
- verb: POST
- url: "localhost:3000/readTextFile"
- body: {"path": "\\\enter path name"}

5. READ TEXT INSIDE IMAGE FILE
- verb: POST
- url: "localhost:3000/readImageFile"
- body: {"path": "\\\enter path name"}

6. READ TEXT INSIDE PDF FILE
- verb: POST
- url: "localhost:3000/readPDFFile"
- body: {"path": "\\\enter path name"}
