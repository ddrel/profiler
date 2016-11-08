const cookie = require('cookie');
const cookieParser = require('cookie-parser');
var __participant__connected = 0;

module.exports= function(wsserver,SessionStore,app){
const _origins = "http://" + process.env.IPADDRESS + ":"  + "*" + " " + process.env.IPADDRESS + ":"  + "*";    
const io = require('socket.io')(wsserver,{origins:'*:*'});
io.set("origins","*:*");
var authorization  = function(socket, next) {
    var handshake = socket.request;
    if (handshake.headers.cookie) {
        handshake.cookie = cookie.parse(handshake.headers.cookie);
        //parseSignedCookie 
            handshake.sessionID = cookieParser.signedCookie(handshake.cookie['fcc.sid'], 'victoriasecret');
            SessionStore.get(handshake.sessionID, function (err, ss) {       
                if(ss.passport.user==null){
                    console.log("aaa");
                    next(new Error('not authorized'));            
                }else{
                    handshake.user = ss.passport;                    
                    //console.log("bbbbbbb");
                    next();
                } 
                    
            })
        }  
    next(new Error('not authorized'));
}

io.on("connection",function(socket){
    var count = Object.keys(this.adapter.nsp.connected).length
        socket.broadcast.emit("participantCount", count);

    socket.on('respondanswer',function(data){                
        socket.broadcast.emit("clientrespondtoquestion",data);
        socket.broadcast.emit("broadcastinfo",{});
    });

    socket.on("broadcastquestion",function(data){
        console.log("broadcastquestion");                   
         this.broadcast.emit("broadcastinfo",{});
         this.broadcast.emit("questionready",{});                  
    });

    socket.on('disconnect',function(){
        var count = Object.keys(this.adapter.sids).length;                 
        __participant__connected = count;
        socket.broadcast.emit("participantCount", count);
    });

});


/*
var participant = io.of('/participant');
participant.use(authorization)
.on('connection', function (socket) {  
    var count = Object.keys(this.adapter.nsp.connected).length
    //console.log("participant Count: " + count);
    //console.log(this.adapter.nsp.connected);
    admin.emit("participantCount", count);
    __participant__connected = count;

    socket.on('disconnect',function(){
        var count = Object.keys(this.adapter.sids).length;                 
        __participant__connected = count;
        admin.emit("participantCount", count);
    });
    
    socket.on('respondanswer',function(data){
        console.log(data);        
        admin.emit("clientrespondtoquestion",data);
        public.emit("broadcastinfo",{});
    });

    socket.on("broadcastquestion",function(data){
         //console.log("messagee broadcast by admin")
         socket.emit("questionready",data); 
         socket.emit("broadcastinfo",{});         
    });

    socket.on("participantclientconnected",function(data){
        console.log("/participant:getclientconnected");
        admin.emit("participantCount", count);
        admin.emit("clientrespondtoquestion",{});
    });

    socket.on("disconnectClient",function(){
        __users__connected = count;
          this.disconnect();  
    });
})
.on('disconnect', function (socket) {
    

});


var admin = io.of('/admin');
admin.use(authorization)
.on('connection', function (socket) {
     socket.on("broadcastquestion",function(data){
         //console.log("messagee broadcast by admin")
         participant.emit("questionready",data); 
         public.emit("broadcastinfo",{});         
    });
    
    socket.on("admin-datachange",function(data){    
        admin.emit("notify-datachange",data);
    });

    socket.on("getclientconnected",function(data){    
        admin.emit("participantclientconnected",__participant__connected);
    });

    
});

var public = io.of('/public');
public.on('connection', function (socket) {
    socket.on("broadcastinfo",function(data){
                  
    });
   

    
});

*/

/*
io.on('connection', function (socket) {
    console.log(socket.adapter.sids);   
    //console.log(Object.keys(socket)); 
    //console.log(socket.handshake); 
});

io.on('message', function (socket) {
 
});
*/
}
