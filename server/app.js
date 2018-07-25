var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var createWs = require('./websocket/socket.js');
var fs = require('fs');
var userJson = './data/user.json';

// 创建websocket服务 
createWs();

app.use(bodyParser.urlencoded({ extended: false }));  

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  // res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/test', function (req, res) {
  console.log(req.query);
  res.status(200),
  res.json({code: 1,data:'this is a test'})
});

// fs.readFile(userJson, 'utf8', function (err, data) {
//   if (err) console.log(err);
//   var test1 = JSON.parse(data);
//   console.log(test1);
//   test1.push({name: "jvid",pwd:"jvid",isonline: false})
//   // test1.name = "li";
//   var t = JSON.stringify(test1);
//   fs.writeFileSync(userJson, t)
// });

/*
  code: 
    -1 用户不存在
    1 成功
    2 密码不正确
*/
app.post('/login',function(req,res){
  var obj = req.body;
  fs.readFile(userJson, 'utf8', function (err, data) {
    if (err) console.log(err);
    userList = JSON.parse(data);
    var code = -1;
    var _data = {}
    for (var i = 0, len = userList.length; i < len; i++) {
      if (userList[i].name == obj.name) {
        if (userList[i].pwd == obj.pwd) {
          code = 1
          _data.name = obj.name;
        } else {
          code = 2
        }
      }
    }
    res.status(200),
    res.json({
      code: code,
      data: _data
    })
  });
  
})

//配置服务端口
var server = app.listen(9999, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})