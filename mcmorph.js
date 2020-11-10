const WebSocket = require('ws');
const app = require('express')();
const server = require('http').Server(app);
const util = require('util');

// who will not be morphed
var exempt = 'suphibye2';
// who is the target  
// or do @r for random or 
// @a for everyone but exempt player
var target = '@r';

//WebSocket settings
var settings = {
    address: 'localhost',
    port: 19131
};

// socket functions
function sendcmd(cmd) {
    return JSON.stringify({
        "body": {
            "origin": {
                "type": "player"
            },
            "commandLine": util.format(cmd),
            "version": 1
        },
        "header": {
            "requestId": "00000000-0000-0000-000000000000",
            "messagePurpose": "commandRequest",
            "version": 1,
            "messageType": "commandRequest"
        }
    });
}

function subtoevent(subevent) {
    return JSON.stringify({
        "body": {
            "eventName": util.format(subevent),
        },
        "header": {
            "requestId": "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx",
            "messagePurpose": "subscribe",
            "version": 1,
            "messageType": "commandRequest"
        }
    });
}
function say(string) {
  sendcmd('say ' + string);
}
/*
function setupwolf() {
  var select = 'foo';
  if(target === '@a' || '@r') {
    select = '[tag=!mammal]';
  } else {
    select = ' ';
  }
  
 sendcmd('execute ' + target + select + ' ~~~ /summon ~~~ wolf minecraft:on_tame');
 sendcmd('execute ' + target + select + ' ~~~ /tag @e[type=wolf,r=10] fluffymammal');
  
*/

/*
function crawlstart(){
  var select = ' ';
  if(target === '@a' || '@r') {
    select = '[tag=!mammal]';
  } else {
    select = '';
  }
  //sets surrounding block to barrier
  sendcmd('execute ' + target + select + ' ~~~ /fill ~1~3~1 ~-1~1~1 barrier');
  //sets head block to water
  sendcmd('execute  ' + target + select + ' ~~~ /setblock ~~1~ water');
  // removes extra barriers
  sendcmd('')
}
*/


const wss = new WebSocket.Server({server});

wss.on('connection', socket => {
  //greetings & credits
  socket.send(sendcmd('say youve connected to §3mc mob morph gimick'));
  socket.send(sendcmd('say made by §4lsnipernubz'));
  socket.send(sendcmd('say inspired by §al@Dream§r/§l@GeorgeNotFound'));
  socket.send(sendcmd('say main command by §l9@LEGENDS77YT'));
  
  //subscribe to playerchat
  socket.send(subtoevent('PlayerMessage'));
  // tags player thats exempt
   //socket.send(sendcmd('tag ' + exempt + ' mammal'));
// make sure there isnt two
 socket.send(sendcmd('kill @e[type=wolf,tag=fluffymammal]'));

// sets up wolf
  var select = 'foo';
  if(target === '@a' || '@r') {
    select = '[tag=!mammal]';
  } else {
    select = ' ';
  }
 socket.send(sendcmd('execute ' + target + select + ' ~~~ /summon wolf ~~~ minecraft:on_tame'));
 socket.send(sendcmd('execute ' + target + select + ' ~~~ /tag @e[type=wolf,r=10] add fluffymammal'));
 
  
  //tps wolf to player
  var tpwolf = setInterval(function() {
     var selectt = 'foo';
  if(target === '@a' || '@r') {
    selectt = '[tag=!mammal]';
  } else {
    selectt = ' ';
  }
    socket.send(sendcmd('execute @e[type=wolf,r=3,tag=fluffymammal] ~~~ /effect @p invisibility 99 225 true'));
    socket.send(sendcmd('execute ' + target + selectt + ' ~~~ /tp @e[type=wolf,tag=fluffymammal]' + target + selectt));
  }, 20); //tpwolf
  
}); //socket

server.listen(settings.port, () => {
    console.log('listening on ' + settings.port);
});
