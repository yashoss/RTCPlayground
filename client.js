var connection = new WebSocket('ws://localhost:9090');
var name = "";

var loginInput = document.querySelector("#loginInput");
var loginBtn = document.querySelector("#loginBtn");
var otherUsernameInput = document.querySelector("#otherUsernameInput");
var connectToOtherUsernameBtn = document.querySelector("#connectToOtherUsernameBtn");
var connectedUser, myConnection;

loginBtn.addEventListener("click", function(e){
  name = loginInput.value;

  if(name.length > 0){
    send({
      type: "login",
      name: name
    });
  }

});

connection.onmessage = function(message) {
  console.log("Got message", message.data);
  var data = JSON.parse(message.data);

  switch(data.type) {
    case "login":
      onLogin(data.success);
      break;
    case "offer":
      onOffer(data.offer, data.name);
      break;
    case "answer":
      onAnswer(data.answer);
      break;
    case "candidate":
      onCandidate(data.candidate);
      break;
    default:
      break;
  }
}

function onLogin(success) {
  if(success === false) {
    alert("username failed")
  }else {
    // Creating RTCPeerConnection object
    var configuration = {
      "iceservers": [{ "url": "stun:stun.1.google.com:19302" }]
    }

    myConnection = new RTCPeerConnection(configuration);
    console.log("PeerConnection object created");
    console.log(myConnection);

    // setup ice handling
    myConnection.onicecandidate = function(e) {

      if (e.candidate) {
        send({
          type: "candidate",
          candidate: event.candidate
        });
      }
    };

  }

};

connection.onopen = function() {
  console.log("Connected");
};

connection.onerror = function(err) {
  console.log("Got error", err);
};

// Alias for sending messages in JSON format
function send(message) {
  if(connectedUser) {
    message.name = connectedUser;
  }

  connection.send(JSON.stringify(message));
};

connectToOtherUsernameBtn.addEventListener("click", function(){
  var otherUsername = otherUsernameInput.value;
  connectedUser = otherUsername;

  if(otherUsername.length > 0) {
    myConnection.createOffer(function(offer) {
      console.log();
      send({
        type: "offer",
        offer: offer
      });

      myConnection.setLocalDescription(offer);
    }, function(error){
      alert("An error has occured.");
    });
  }
})

function onOffer(offer, name) {
  connectedUser = name;
  myConnection.setRemoteDescription(new RTCSessionDescription(offer));

  myConnection.createAnswer(function(answer) {
    myConnection.setLocalDescription(answer);

    send({
      type: "answer",
      answer: answer
    });

  }, function(error) {
    alert("oops...error");
  });
}

function onAnswer(answer) {
  myConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function onCandidate(candidate) {
  myConnection.addIceCandidate(new RTCIceCandidate(candidate));
}
