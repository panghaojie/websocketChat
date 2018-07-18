var ws = require('nodejs-websocket');
var PORT = 3000;

var userCount = 0;

var createWs = function(){
  function broadcast(str) {
    server.connections.forEach(function (connection) {
      connection.sendText(str)
    })
  }

  var server = ws.createServer(function(conn){
    console.log('a new user come in')
    userCount++
    conn.nickname = 'user'+userCount;
    broadcast(conn.nickname + ' come in');
    conn.on('text',function (str) {
      console.log('received ' + str)
      broadcast(str)
    })
    conn.on('close',function(code,reason){
      console.log('connection closed')
      broadcast(conn.nickname + ' left')
    })
    conn.on('error',function(err){
      console.log('this is a error ',err)
    })
  }).listen(PORT)
  console.log('websocket server is ready');
  
}

module.exports = createWs;