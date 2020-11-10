const WebSocket = require('ws');
const app  = require('express');
const server = require('http').Server(app);
const util = require('util');
const format = require('fancy-format-log');
const options = {
  format: 'mm:ss:ms',   // Optional - Default is 'HH:mm:ss'
  style: 'dim.green'                  // Optional - Default is 'grey'
};
const f = format(options);
var fs = require('fs');
var toLog = fs.createWriteStream('log.txt', {flags: 'a'});

var settings ={
 host: 'localhost',
 port: 19131,
};


var events = ['AdditionalContentLoaded','AgentCommand','AgentCreated','ApiInit','AppPaused','AppResumed','AppSuspended','AwardAchievement','BlockBroken','BlockPlaced','BoardTextUpdated','BossKilled','CameraUsed','CauldronUsed','ChunkChanged','ChunkLoaded','ChunkUnloaded','ConfigurationChanged','ConnectionFailed','CraftingSessionCompleted','EndOfDay','EntitySpawned','FileTransmissionCancelled','FileTransmissionCompleted','FileTransmissionStarted','FirstTimeClientOpen','FocusGained','FocusLost','GameSessionComplete','GameSessionStart','HardwareInfo','HasNewContent','ItemAcquired','ItemCrafted','ItemDestroyed','ItemDropped','ItemEnchanted','ItemSmelted','ItemUsed','JoinCanceled','JukeboxUsed','LicenseCensus','MascotCreated','MenuShown','MobInteracted','MobKilled','MultiplayerConnectionStateChanged','MultiplayerRoundEnd','MultiplayerRoundStart','NpcPropertiesUpdated','OptionsUpdated','performanceMetrics','PackImportStage','PlayerBounced','PlayerDied','PlayerJoin','PlayerLeave','PlayerMessage','PlayerTeleported','PlayerTransform','PlayerTravelled','PortalBuilt','PortalUsed','PortfolioExported','PotionBrewed','PurchaseAttempt','PurchaseResolved','RegionalPopup','RespondedToAcceptContent','ScreenChanged','ScreenHeartbeat','SignInToEdu','SignInToXboxLive','SignOutOfXboxLive','SpecialMobBuilt','StartClient','StartWorld','TextToSpeechToggled','UgcDownloadCompleted','UgcDownloadStarted','UploadSkin','VehicleExited','WorldExported','WorldFilesListed','WorldGenerated','WorldLoaded','WorldUnloaded'];

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
                             
function subscribeEvent(event) {
    return JSON.stringify({
        "body": {
            "eventName": util.format(event),
        },
        "header": {
            "requestId": "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx",
            "messagePurpose": "subscribe",
            "version": 1,
            "messageType": "commandRequest"
        }
    });
}
function unsubscribeEvent(event) {
  return JSON.stringify({
    "body": {
        "eventName": util.format(event), // Event to subscribe to
    },
    "header": {
        "requestId": "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx",
        "messagePurpose": "subscribe", // Notice that messagePurpose is different from messageType
        "version": 1,
        "messageType": "commandRequest"
    }
  });
}
//extracts everything in between two sub strings
function extractstring(first, second, string){
  var regExString = new RegExp("(?:"+first+")((.[\\s\\S]*))(?:"+second+")", "ig"); //set ig flag for global search and case insensitive

var testRE = regExString.exec(string);
if (testRE && testRE.length > 1) //RegEx has found something and has more than one entry.
 {  
    return(testRE[1]); //is the matched group if found
 }
}

const wss = new WebSocket.Server({server});

wss.on('connection', socket => {
    f.log('user connected');
    socket.send(sendcmd('say hello human'));
   
   //subscribes to all events
    for(var i = 1; i <= events.length; i++) {
   var jk = events[i];
    socket.send(JSON.stringify({
    "body": {
        "eventName": jk // Event to subscribe to
    },
    "header": {
        "requestId": "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx",
        "messagePurpose": "subscribe", // Notice that messagePurpose is different from messageType
        "version": 1,
        "messageType": "commandRequest"
    }
  }));
}
//unsubscribes from PlayerTravelled
socket.send(JSON.stringify({
    "body": {
        "eventName": "PlayerTravelled" // Event to unsubscribe to
    },
    "header": {
        "requestId": "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx",
        "messagePurpose": "unsubscribe", // Notice that messagePurpose is different from messageType
        "version": 1,
        "messageType": "commandRequest"
    }
  })
 );

//unsubscribes from PlayerTransform
socket.send(JSON.stringify({
    "body": {
        "eventName": "PlayerTransform" // Event to unsubscribe to
    },
    "header": {
        "requestId": "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx",
        "messagePurpose": "unsubscribe", // Notice that messagePurpose is different from messageType
        "version": 1,
        "messageType": "commandRequest"
    }
  })
 );
    socket.on('message', packet => {
      const res = JSON.parse(packet);
	      f.log("event: " + res.body.eventName);
	       f.log(res.body.properties);
	        toLog.write(res.body.eventName);
		      toLog.write(res.body.measurements);
 	        toLog.write(res.body.properties);           
	      if (res.header.messagePurpose === 'event' ) {
	       if(res.body.eventName === 'PlayerMessage') {
	          if (res.body.properties.Sender !== 'External') {
                   var cevent = res.body.properties.Message.slice(1);
                    if(res.body.properties.Message.indexOf("+") !== -1) {
           	       socket.send(subscribeEvent(cevent)); return;
            	       }
                    if(res.body.properties.Message.indexOf("-") !== -1) {
             	       socket.send(unsubscribeEvent(cevent)); return;
             	       }
	              }
	             }
	            }
	     }); // message
	    
});//socket
    
server.listen(settings.port, () => {
    f.log('listening on ' + settings.port);
});
