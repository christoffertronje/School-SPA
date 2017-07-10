let webSocket = require('./webSocket');
let Username = require('./localStorage');
let localStorage = require('./localStorage');

module.exports = {
  buildingChat: buildingChat,
  buildingStartUpChat: buildingStartUpChat
}


function buildingChat(div,username,usernameLabel){


  div.firstElementChild.nextElementSibling.appendChild(usernameLabel);

  let templateInputText = document.querySelectorAll('#chatContainer template')[0];
  let chatTools = document.importNode(templateInputText.content.firstElementChild, true);
  let chatWindow = chatTools.firstElementChild;
  let inputText = chatTools.firstElementChild.nextElementSibling;
  let sendButton = inputText.nextElementSibling;
  div.lastElementChild.appendChild(chatTools);/*
  div.lastElementChild.appendChild(sendButton);
  div.lastElementChild.appendChild(inputText);*/

  div = webSocket.webSocket(div,sendButton,inputText,username);

  return div;

}

function buildingStartUpChat(chatDiv){

  chatDiv.classList.add('chatApp');

  let templateInputText = document.querySelector('#userNameTemp');
  let tempDiv = document.importNode(templateInputText.content.firstElementChild, true);
  let userNameInput = tempDiv.firstElementChild.nextElementSibling;
  let imageTemp = document.querySelector('#icons');
  let icon = document.importNode(imageTemp.content.firstElementChild, true);
  chatDiv.firstElementChild.appendChild(icon);
  if (Username.getUsername() != null) {
    let nameButton = tempDiv.querySelectorAll('.startChat')[1];
    nameButton.textContent = Username.getUsername().Username;


  }

  if(localStorage.getUsername() == null) {
    tempDiv.removeChild(tempDiv.querySelector('#startChat2'));
    console.log('funkaaaarrrrr!!!');
  }

  console.log(localStorage.getUsername());


  chatDiv.querySelector('.app').appendChild(tempDiv);


  for (let i = 0; i < tempDiv.querySelectorAll('.startChat').length; i += 1) {
    let tempDivButton = tempDiv.querySelectorAll('.startChat')[i];
    tempDivButton.addEventListener('click', function (event) {
      let username;
      if (event.target.id.toString() === 'startChat1')
        username = userNameInput.value;
      else
        username = event.target.textContent;


      Username.saveUsername(username);

      let usernameLabel = tempDiv.firstElementChild;

      chatDiv.querySelector('.app').removeChild(tempDiv);

      chatDiv = buildingChat(chatDiv, username, usernameLabel);


    });
  };

  return chatDiv;

}
