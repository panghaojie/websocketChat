var http = require('http');
var fs = require('fs');
var httpObj = http.createServer(function (req, res) {
  var url = req.url == '/' ? 'index.html' : req.url;
  console.log(url);
  fs.readFile( './' + url, 'utf-8', function (err, data) {
    //res.write服务器的相应，当成功的时候，服务器会传输一个data数据，相应结束需要end
    if (err) {
      res.write('404,您访问的页面不存在');
      res.end();
    } else {
      res.write(data);
      res.end();
    }
  });
});
//监听端口
var server = httpObj.listen(8899, function () {
  console.log('server create success')
});