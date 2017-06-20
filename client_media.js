function hasUserMedia() {
  console.log("check");
  return !!navigator.mediaDevices.getUserMedia;
}

if(hasUserMedia()) {
  navigator.mediaDevices.getUserMedia({video: true, audio: true }).then(function (stream){
    console.log("getting media");
    var video = document.querySelector('video');
    video.srcObject = stream;
    window.stream = stream;
  }).catch(function(err){console.log("error")})
}else {
  alert("Error. WebRTC is not supported!");
}
