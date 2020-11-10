const WebSocket = require('ws');
const app = require('express')();
const server = require('http').Server(app);
const util = require('util');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var settings ={
 host: 'localhost',
 port: 19131,
};

// socket functions
function sendcmd(cmd){
  return JSON.stringify({
    "body": {
	"origin": {
		"type": "player"
	},
        "commandLine": util.format(cmd),
	 "version": 1
			},
			"header": {
				"requestId": "00000000-0001-0000-000000000000",
				"messagePurpose": "commandRequest",
				"version": 1,
				"messageType": "commandRequest"
	                         }
			       });
                              }
                              
const wss = new WebSocket.Server({server});

wss.on('connection', socket => {
socket.send(sendcmd('say hello!'));
socket.send(sendcmd('give @a cookie 1'));

 // CLI interface
     rl.on('line', (line) => {
       socket.send(sendcmd(line));
     }); 
     
});//socket

server.listen(settings.port, () => {
 console.log("listening on: " + settings.port);
});
