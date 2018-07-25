var http = require('http');
var fs = require('fs');
var path = require('path');

var mimeTypes = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "js": "application/javascript"
};

var lookup = function(pathName) {
    let ext = path.extname(pathName);
    ext = ext.split('.').pop();
    console.log(ext, '17',pathName)
    return mimeTypes[ext] || mimeTypes['txt'];
}

var respondNotFound = function (req, res) {
  res.writeHead(404, {
      'Content-Type': 'text/html'
  });
  res.end(`<h1>Not Found</h1><p>The requested URL ${req.url} was not found on this server.</p>`);
}

var respondFile = function(pathName, req, res) {
  const readStream = fs.createReadStream(pathName);
  res.setHeader('Content-Type', lookup(pathName));
  readStream.pipe(res);
}

var httpObj = http.createServer(function (req, res) {
  var pathName = req.url == '/' ? './index.html' : '.' + req.url;
  // pathName = __dirname+pathName;
  console.log(pathName);
  fs.stat(pathName, function(err, stat) {
    // console.log(err)
    if (!err) {
        respondFile(pathName, req, res);
    } else {
        respondNotFound(req, res);
    }
  });
});
//监听端口
var server = httpObj.listen(8899, function () {
  console.log('server create success')
});