var socket = io.connect("http://localhost:7000");
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');
var bigcontainer = document.getElementById('chat-window');
var roomContainer=document.getElementById('room-container');
var c = document.getElementById("can1");
var remi = document.getElementById("img1");
if (output != null) {
    var name = prompt('What is your name?')
if (name.length == 0) {
    handle.value='Anonymous';
}
else{
    handle.value=name;
}
appendmessage('You joined')
socket.emit('new-user',roomName,handle.value)

btn.addEventListener('click',function(){
    socket.emit('chat',roomName,{
        message:message.value,
        handle:handle.value

    })

    message.value=""
    
    message.addEventListener('keypress',function(){
        socket.emit('typing',roomName,handle.value);
    })
});

}
socket.on('room-created', room => {
    var roomElement = document.createElement('div')
    roomElement.innerText = room
    var roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
  })




socket.on('chat',function(data){
    feedback.innerHTML=""
    output.innerHTML+= "<p><strong>"+data.handle+":</strong>"+data.message+"</p>";
})
socket.on('typing',function(data){
    feedback.innerHTML= "<p> <em>"+data+" is typing...</em> </p>";
})
socket.on('newconnect',function(data){
    output.innerHTML+= "<p><em>"+data+" has joined</em></p>";
})

socket.on('userdisconnected',function(data){
    output.innerHTML+= "<p><em>"+data+" has disconnected</em></p>";
})

function appendmessage(message) {
    var messageElement = document.createElement('p')
    messageElement.innerText = message
    output.append(messageElement)
  }
//streaming//streaming
  

var videoElem = document.getElementById("video");
var startElem = document.getElementById("start");
var stopElem = document.getElementById("stop");



var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};


startElem.addEventListener("click", function(evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function(evt) {
  stopCapture();
}, false); 


 function startCapture() {
  // logElem.innerHTML = "";

  // var chunks=[]
      
     navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
     .then(function(stream) {
      //connect the media stream to the first video element
      videoElem.style.display="none";
          videoElem.srcObject = stream;
           videoElem.play();
       
    // videoElem.srcObject=streams
    // chunks.push(stream)
    // let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
    //             chunks = [];

var ctx = c.getContext('2d');
var i;

// var d=ctx.drawImage(videoElem,5,5,260,125)
videoElem.addEventListener('play',function() {i=window.setInterval(function() {
  ctx.drawImage(videoElem,5,5,850,350)
  var imcapture=c.toDataURL()
  socket.emit('streambroadcast',roomName,imcapture)},1000/24);
},false)

videoElem.addEventListener('pause',function() {window.clearInterval(i);},false);
videoElem.addEventListener('ended',function() {clearInterval(i);},false);

    
  //   {
  //     encoding: 'binary'
  // }
    
  
    
    
    
     
  }) .catch(function(err) {
    console.error("Error: " + err);
  })
  
} function stopCapture(evt) {
  var tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
} 

/////second part for displaying

socket.on('streambroadcast',function(streamobj){ 
  videoElem.style.display = "none";
  img1.style.display = "none";
  var ctx = c.getContext('2d');
  var image = new Image();
image.onload = function() {
    ctx.drawImage(image,5,5,850,350);
};

  // console.log(typeof(streamobj))
  image.src=streamobj
  // img1.src=streamobj
  // ctx.drawImage(streamobj,5,5,260,125)


  // chunks2=[]
  // chunks2.push(streamobj)
  // let blob2 = new Blob(chunks2, { 'type' : 'video/mp4;' });
  // videoElem.addEventListener('play',function() {i=window.setInterval(function() {streamobj},20);},false);

  // videoElem.srcObject= blob2
  // videoElem.play(); 
                // chunks2 = [];
  
  
  })