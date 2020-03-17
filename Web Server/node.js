var http = require('http');
var url = require('url');
var fs = require('fs');
let { PythonShell } = require('python-shell');
const { parse } = require('querystring');

http.createServer(function (req, res) {

    if (req.method === 'POST') {
        console.log("A POST request has been called.")
        var body = '';

        req.on('data', function (data) {
            body += data;
            console.log("The data has been parsed!")
        });

        req.on('end', function () {

            let shell = new PythonShell('list_script.py', { mode: 'text', args: [body] });
            console.log("The shell has been made!");

            shell.on('message', function (message) {
                console.log(message);
            });

            shell.end(function (err, code, signal) {
                if (err) throw err;
                console.log('The exit code was: ' + code);
                console.log('The exit signal was: ' + signal);
            });
        });
    };

    //Code for closing server from browser
    if (url.parse(req.url, true).pathname == '/exit') {
        process.exit();
    }
    else if (url.parse(req.url, true).pathname == '/') {
        req.url = "/index.html"
    }

    //Set up path to object we are loading, very important!
    var q = url.parse(req.url, true);
    //The . and webpages is how you would declare your path, when this work is done, filename should point to the object that is being loaded. EACH object will be loaded this way, including CSS.
    var filename = "./webpages" + q.pathname;

    //Set up a container for later
    var content_type = "";

    //Check what type of file it is, so you can set the header later.
    if (filename.includes("html")) {
        content_type = 'text/html'
    }
    else if (filename.includes("css")) {
        content_type = 'text/css'
    }
    else if (filename.includes("js")) {
        content_type = 'text/javascript'
    }

    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': content_type }); //This is where we set the content type so it knows what to do with a css vs an html.
            return res.end("404 Not Found");
        }


        res.writeHead(200, { 'Content-Type': content_type }); //This is where we set the content type so it knows what to do with a css vs an html.
        res.write(data);
        return res.end();
    });
}).listen(8080)