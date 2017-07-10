let errorHandling = require('./ErrorHandling');
let Username = require('./localStorage');



module.exports = {
  webSocket: webSocket,
  closeSocket: webSocket.closeSocket
}



function webSocket(div,sendButton,inputText,username) {

  var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "charcords");


  div.querySelector('.closeButton').addEventListener('click',function () {
    socket.close();
  });


  let backgroundColor = false;
  let app = div;
  let scrollWindow = app.querySelector('.scrollChat');
  let button = sendButton;
  let text = inputText;


  let settingsBar = app.firstElementChild.nextElementSibling;
  let usernameLabel = settingsBar.firstElementChild;

  let sendData = {
    type: "message",
    data: "",
    username: username,
    channel: "The Avengers",
    key: "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
  };


  button.addEventListener("click", function (event) {
    backgroundColor = sendMessage(sendData,text,socket,scrollWindow,backgroundColor);
  });


  text.addEventListener("keyup", function(event) {
      if (event.keyCode == 13) {
        event.stopPropagation();

       // sendData.data = sendData.data.substring(sendData.data.length-)

        backgroundColor = sendMessage(sendData, text, socket, scrollWindow, backgroundColor);
      }
  });



  socket.addEventListener("message", function (event) {
    let newMessageTemp = document.querySelectorAll('#chatContainer template')[1];
    let para = document.importNode(newMessageTemp.content.firstElementChild, true);

    let newMessage = JSON.parse(event.data);
    if(newMessage.type === 'notification' || ((newMessage.type == 'message') && (newMessage.data.length>0))) {

      if(backgroundColor) {
        para.classList.add('sentTextBackground1');
        backgroundColor = false;
      }
      else{
        para.classList.add('sentTextBackground2');
        backgroundColor = true;
      }

      if(newMessage.username === sendData.username) {
        para.textContent = 'Me: ' + sendData.data;
        para.classList.add('selfSent');
      }
      else{
        para.textContent = newMessage.username + ': ' + newMessage.data;
        para.classList.add('recievedMessage');
      }
      scrollWindow.appendChild(para);
      scrollWindow.scrollTop = scrollWindow.scrollHeight;
    }

  });


  usernameLabel.textContent = usernameLabel.textContent + username;

  usernameLabel.addEventListener('click',function (event) {

    usernameLabel.textContent = 'Username: ';

    let templateInputText2 = document.querySelector('#inputText');
    let inputText = document.importNode(templateInputText2.content.firstElementChild, true);
    inputText.value = username;

    let buttonTemp = document.querySelector('#buttonTemp');
    let button = document.importNode(buttonTemp.content.firstElementChild, true);
    button.textContent = 'Done';

    let settingsBar = div.firstElementChild.nextElementSibling;

    settingsBar.appendChild(inputText);
    settingsBar.appendChild(button);

    button.addEventListener('click',function (event) {

      let newUsername = inputText.value;
      settingsBar.removeChild(inputText);
      settingsBar.removeChild(event.target);
      usernameLabel.textContent = usernameLabel.textContent + newUsername;
      sendData.username = newUsername;
      Username.saveUsername(newUsername);



    });






  });



  return app;

}



function sendMessage(sendData,text,socket,scrollWindow,backgroundColor){

  if(errorHandling.validMessage(text.value))
    return;

  sendData.data = text.value;
  socket.send(JSON.stringify(sendData));
  scrollWindow.scrollTop = scrollWindow.scrollHeight;
  text.value = '';

  return backgroundColor;
}
