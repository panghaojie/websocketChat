var ws = require('nodejs-websocket');
var PORT = 3000;

var userName = '';
var count = 0;

var createWs = function(){

  function broadcast(str) {
    server.connections.forEach(function (connection) {
      connection.sendText(str)
    })
  }

  function getTime() {
    var time = new Date();
    var h = time.getHours() < 10 ? ('0' + time.getHours()) : time.getHours();
    var m = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes();
    return h + ' : ' + m;
  }

  var server = ws.createServer(function(conn){
    count++
    conn.on('text',function (str) {
      var obj = JSON.parse(str);
      var msg;
      if(obj.type == 'join'){
        var msg = {
          type: 'sys',
          content: obj.content + '加入聊天',
          from: obj.from
        }
        userName = obj.from;
      }else {
        msg = {
          type: 'text',
          content: obj.content,
          from: obj.from
        }
      } 
      broadcast(JSON.stringify(msg));
    })
    conn.on('close',function(code,reason){
      count--
      var msg = {
        type: 'sys',
        content: userName + '离开',
        from: userName
      }
      broadcast(JSON.stringify(msg))
    })
    conn.on('error',function(err){
      console.log('this is a error ',err)
    })
    if(count == 1){
      setInterval(function(){
        var msg = {
          type: 'time',
          content: getTime(),
          from: userName
        }
        broadcast(JSON.stringify(msg));
      },2 * 60 * 1000)
    }
    
  }).listen(PORT)
  console.log('websocket server is ready');
  
}

module.exports = createWs;