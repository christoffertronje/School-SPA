(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  validMessage: validMessage,
};



function validMessage(message){


  console.log('message: ' + message);

  if(message.length === 0 || (message.charAt(0).includes('\\') && message.charAt(1).includes('n') && message.length === 2)) {
    return true;
  }


}

},{}],2:[function(require,module,exports){


function memory(rows,cols, container) {
  let cantTurn = false;
  let score = 0;
  let tiles = tileArray(rows, cols);
  let interval;
  let attempts = 0;
  let turned = false;
  let roundOne;
  let roundTwo;
  let a;
  let target;
  let templateDiv = document.querySelectorAll('#memoryTemp')[0].content.firstElementChild;

  let div = document.importNode(templateDiv, false);

  tiles.forEach(function (tile, i) {

    a = document.importNode(templateDiv.firstElementChild, true);     // question image

    a.firstElementChild.setAttribute('data-brickNumber', i);
    a.firstElementChild.classList.add('aTile');


    if (i % cols === 0) {
      div.appendChild(document.createElement('br'));
    }
    div.appendChild(a);
  });


  div.addEventListener('click', function (event) {

    if(cantTurn)
      return;

    event.preventDefault();

    target = checkEventTarget(event, target);
    let i = parseInt(target.getAttribute('data-brickNumber'));

    roundOne = {
      imageTile: target,
      whatImage: tiles[i],
      index: i
    };

    let path = 'image/' + roundOne.whatImage + '.png';
    target.src = path;      // turn tile

    if (turned) {       // turn second tile
      if (roundOne.index != roundTwo.index) {
        turned = false;
        attempts += 1;
        if (roundOne.whatImage === roundTwo.whatImage) {        // check if same tile
          removeTiles(roundOne.imageTile, roundTwo.imageTile,interval);
          score += 1;
          if (score === ((rows * cols) / 2)) {
            let youWonLabelTemp = document.querySelector('#minimizeTemp');
            let youWonLabel = document.importNode(youWonLabelTemp.content.firstElementChild.firstElementChild, true);
            youWonLabel.classList.add('middle');
            youWonLabel.textContent = 'You won on ' + attempts + ' tries!';
            div.appendChild(youWonLabel);
            console.log('You won on ' + attempts + ' tries!');
          }

        }
        else {       // not the same, turn back
          cantTurn=true;

          interval = setInterval(function(){

            target.setAttribute('src', 'image/0.png');
            roundTwo.imageTile.setAttribute('src', 'image/0.png');
            console.log("Turn tiles back!");
            cantTurn = false;
            clearInterval(interval);

          }, 1500);
        }
      }
    }

    else {   // turned one tile
      turned = true;
      roundTwo = roundOne;
    }
  });
  container.querySelector('.app').appendChild(div);
  return container;
}



function removeTiles(newTile, rememberTile,interval){

  interval = setInterval(function(){
    newTile.parentNode.classList.add('remove');
    rememberTile.parentNode.classList.add('remove');
    console.log('Pair found!!');
    clearInterval(interval);
  }, 50);


}

function shuffle(a) {
  let j, x, p;
  for (p = a.length; p; p--) {
    j = Math.floor(Math.random() * p);
    x = a[p - 1];
    a[p - 1] = a[j];
    a[j] = x;
  }
}

function tileArray(rows,cols){

  let arr = [];
  for(let q = 1; q<=(rows*cols)/2; q+=1){
    arr.push(q);
    arr.push(q);
  }
  shuffle(arr);
  return arr;
}

function checkEventTarget(event, target){

  if (!(event.target.nodeName === 'IMG'))
    target = event.target.firstElementChild;
  else
    target = event.target;
  return target;
}

module.exports = memory;

},{}],3:[function(require,module,exports){
module.exports = {
  moveWindow: moveWindow
}



function moveWindow(div){



  let cords = {
    xCursor: 0,
    yCursor: 0,
    xWindow: 0,
    yWindow: 0
  };

  let selected = null;

  let divDrag = div.firstElementChild;




  document.addEventListener('mousemove',function(e){


    cords.xCursor = document.all ? window.event.clientX : e.pageX;
    cords.yCursor = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
      selected.style.left = (cords.xCursor - cords.xWindow) + 'px';
      selected.style.top = (cords.yCursor - cords.yWindow) + 'px';
    }
    });


  document.addEventListener('mouseup',function(e){
    selected = null;

  });


  divDrag.addEventListener('mousedown',function(){

    selected = div;
    cords.xWindow = cords.xCursor - selected.getBoundingClientRect().left;
    cords.yWindow = cords.yCursor - selected.getBoundingClientRect().top;
  });

  return div;

}


},{}],4:[function(require,module,exports){
let moveWindow = require('./MoveWindow');
let buildingWindow = require('./buildingWindow');
let buildingMemory = require('./buildingMemory');
let buildingChat = require('./buildingChat');
let Username = require('./localStorage');
let buildingWhackDig = require('./buildingWhack');
let Memory = require('./Memory');


let memory =  document.querySelector('#memory');
let chat =  document.querySelector('#chat');
let whack = document.querySelector('#whackulator');

let minimizetemp = document.querySelector('#minimizeListTemp');
let divTempMem = document.importNode(minimizetemp.content.firstElementChild, true);
let divTempChat = document.importNode(minimizetemp.content.firstElementChild, true);
let divTempWhack = document.importNode(minimizetemp.content.firstElementChild, true);

document.body.querySelectorAll('.menuList')[0].appendChild(divTempMem);
document.body.querySelectorAll('.menuList')[1].appendChild(divTempChat);
document.body.querySelectorAll('.menuList')[2].appendChild(divTempWhack);



memory.addEventListener('click', function(event){

  let whatKind = {
    0: 'Memory'
  };
  let memoryDiv = buildingWindow.buildingWindow(whatKind);
  memoryDiv = moveWindow.moveWindow(memoryDiv);
  document.body.querySelector('#appsContainer').appendChild(memoryDiv);

});


chat.addEventListener('click', function(event) {
  let whatKind = {
    1: 'Chat'
  };
  let chatDiv = buildingWindow.buildingWindow(whatKind);

  chatDiv = moveWindow.moveWindow(chatDiv);
  document.body.querySelector('#appsContainer').appendChild(chatDiv);

   chatDiv = buildingChat.buildingStartUpChat(chatDiv);


});


whack.addEventListener('click', function (event) {

  let whatKind = {
    2: 'WackADig'
  };
  let whackDiv = buildingWindow.buildingWindow(whatKind);
  whackDiv = moveWindow.moveWindow(whackDiv);

  whackDiv = buildingWhackDig.buildingWhackDig(whackDiv);
  document.body.querySelector('#appsContainer').appendChild(whackDiv);


});

},{"./Memory":2,"./MoveWindow":3,"./buildingChat":5,"./buildingMemory":6,"./buildingWhack":7,"./buildingWindow":8,"./localStorage":9}],5:[function(require,module,exports){
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

},{"./localStorage":9,"./webSocket":10}],6:[function(require,module,exports){
let memory = require('./Memory');


module.exports = {
  buildingMemory: buildingMemory
}

let counter = 0;

function buildingMemory(div){

  div.classList.add('memoryApp');

  let templateDropDown = document.querySelector('#dropDownMenu');
  let dropDown = document.importNode(templateDropDown.content.firstElementChild, true);
  let childNodes = dropDown.lastElementChild.childNodes;
  div.firstElementChild.nextElementSibling.appendChild(dropDown);
  let newMemoryDiv = memory(4,4,div);

  let imageTemp = document.querySelector('#icons');
  let icon = document.importNode(imageTemp.content.firstElementChild.nextElementSibling, true);
  icon.classList.add('aTile');
  div.firstElementChild.appendChild(icon);


  for(let i = 0; i<childNodes.length;i+=1){
    childNodes[i].addEventListener('click',function (event) {
      let app = newMemoryDiv.querySelector('.app');
      app.removeChild(app.firstElementChild);


      let labelValue = event.target.textContent;
      let rows = labelValue.charAt(0);
      console.log('rows:' + rows);
      let cols = labelValue.charAt(2);
      console.log('cols:' + cols);

      memory(rows,cols,newMemoryDiv);
    });
  }


  counter+=1;

  return newMemoryDiv;


}

},{"./Memory":2}],7:[function(require,module,exports){
module.exports = {
  buildingWhackDig:buildingWhackDig
};


function buildnigStartUpDig(){

}


function buildingWhackDig(whackDiv) {
  let dragBar = whackDiv.firstElementChild;
  let iconTemp = document.querySelector('#icons');
  let icon = document.importNode(iconTemp.content.firstElementChild.nextElementSibling.nextElementSibling, true);
  dragBar.appendChild(icon);
  let numberArray = [];
  let moleCounter=0;
  let labelTemp = document.querySelector('#minimizeTemp');
  let timeLabel = document.importNode(labelTemp.content.firstElementChild.firstElementChild, true);
  let pointsLabel = document.importNode(labelTemp.content.firstElementChild.firstElementChild, true);
  timeLabel.classList.add('diglettLabel');
  pointsLabel.classList.add('diglettLabel');
  pointsLabel.textContent = 'Digletts wacked: ' + 0;
  let menuBar = whackDiv.firstElementChild.nextElementSibling;
  menuBar.appendChild(timeLabel);
  menuBar.appendChild(pointsLabel);
  let app = menuBar.nextElementSibling;
  let seconds = 20;
  let timeCount = setInterval(function(){

    if(seconds === 0){
      clearInterval(timeCount);
      numberArray = null;
      while(app.firstChild)
        app.removeChild(app.firstChild);
    }
    else {
      seconds -= 1;
      timeLabel.textContent = 'Time: ' + seconds;
    }

  }, (1000));



  for(let i = 1;i<17;i+=1) {
    let buttonTempplate = document.querySelector('#oneToNineTemp');
    let image = document.importNode(buttonTempplate.content.firstElementChild, true);

    image.setAttribute('number',i);
    numberArray.push(image);
    whackDiv.querySelector('.app').appendChild(numberArray[i-1]);
    if(i%4===0){
      whackDiv.querySelector('.app').appendChild(document.createElement('br'));
    }
    timeInterval(numberArray[i-1],i,whackDiv);

  }

  whackDiv.querySelector('.app').addEventListener('click',function (event) {

    if(event.target.getAttribute('type')!='image')
      return;


    let target = event.target.getAttribute('number');
    target = numberArray[target-1];

    if(!target.classList.contains('changeColor'))
      return;


    moleCounter+=1;
    pointsLabel.textContent = 'Digletts wacked: ' + moleCounter;



    target.classList.remove('changeColor');
    target.setAttribute('src' , './image/diglettSmashed.png');
    target.classList.add('wacked');

    let interval = setInterval(function(){
      target.classList.remove('wacked');
      clearInterval(interval);
    }, (100));


  });




  return whackDiv;

}

function timeInterval(mole,i,whackDiv){



  let randomNumber;

  if(mole.classList.contains('changeColor'))
    randomNumber = Math.floor((Math.random() * 2000) + 1000);
  else
    randomNumber = Math.floor((Math.random() * 10000) + 2000);

  let interval = setInterval(function(){
    if(!whackDiv.querySelectorAll('.app')[0].firstChild) {
      clearInterval(interval);
      return;
    }
    mole.classList.toggle('changeColor');

    if(mole.classList.contains('changeColor'))
      mole.setAttribute('src', './image/iconDiglett.png');
    else
      mole.setAttribute('src', './image/diglettHole.png');
    clearInterval(interval);

    timeInterval(mole,i,whackDiv);
  }, (randomNumber));

}

},{}],8:[function(require,module,exports){
let buildingMemory = require('./buildingMemory');
let buildingChat = require('./buildingChat');
let webSocket = require('./webSocket');


module.exports = {
  buildingWindow: buildingWindow
};



function buildingWindow(type){

  let templateDiv = document.querySelector('#template');
  let div = document.importNode(templateDiv.content.firstElementChild, true);
  let divDrag = div.firstElementChild;
  let closeButton = divDrag.firstElementChild;
  let miniButton = closeButton.nextElementSibling;


  closeButton.addEventListener('mouseup',function (event) {

    document.body.querySelector('#appsContainer').removeChild(div);
    event.stopPropagation();

  });

  miniButton.addEventListener('click',function (event) {


    let minimizetemp = document.querySelector('#minimizeTemp');
    let li = document.importNode(minimizetemp.content.firstElementChild, true);
    let label = li.firstElementChild;

    label.addEventListener('click',function (event) {


      div.classList.remove('minimized');
      //  miniButton.parentNode.parentNode
      let list = event.target.parentNode.parentNode;
      console.log(list.childElementCount);
      if((list.childElementCount-1) === 0){
        console.log('tar bort hover effekt');
        label.parentNode.parentNode.parentNode.parentNode.classList.toggle('menuBarHover');
      }
      list.removeChild(li);
    });

    label.textContent = type[Object.keys(type)[0]];

    let memButton = document.body.querySelectorAll('.menuList')[Object.keys(type)[0]];
    memButton.querySelector('.dropmenulol').appendChild(li);
    memButton.classList.add('menuBarHover');


    div.classList.add('minimized');
    event.stopPropagation();

  });



  div.addEventListener('mousedown',function (event) {

    document.body.querySelector('#appsContainer').insertBefore(div, document.body.querySelector('#appsContainer').lastElementChild.nextSibling);


  });

  if(type[0] === 'Memory')
    return buildingMemory.buildingMemory(div);
  else if(type[1] === 'Chat')
    return div;
  else if (type[2] === 'WackADig') {
    return div;
  }


}

},{"./buildingChat":5,"./buildingMemory":6,"./webSocket":10}],9:[function(require,module,exports){
module.exports = {
  saveUsername: saveUsername,
  getUsername: getUsername
}

function saveUsername(nick) {

  let username = {
    Username: nick
  };

  localStorage.setItem('Username', JSON.stringify(username));

}

function getUsername() {
  let lastUsername = JSON.parse(localStorage.getItem('Username'));
  return lastUsername;
}



},{}],10:[function(require,module,exports){
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

},{"./ErrorHandling":1,"./localStorage":9}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOC4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvRXJyb3JIYW5kbGluZy5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9Nb3ZlV2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL2J1aWxkaW5nQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvYnVpbGRpbmdNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL2J1aWxkaW5nV2hhY2suanMiLCJjbGllbnQvc291cmNlL2pzL2J1aWxkaW5nV2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9sb2NhbFN0b3JhZ2UuanMiLCJjbGllbnQvc291cmNlL2pzL3dlYlNvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZhbGlkTWVzc2FnZTogdmFsaWRNZXNzYWdlLFxufTtcblxuXG5cbmZ1bmN0aW9uIHZhbGlkTWVzc2FnZShtZXNzYWdlKXtcblxuXG4gIGNvbnNvbGUubG9nKCdtZXNzYWdlOiAnICsgbWVzc2FnZSk7XG5cbiAgaWYobWVzc2FnZS5sZW5ndGggPT09IDAgfHwgKG1lc3NhZ2UuY2hhckF0KDApLmluY2x1ZGVzKCdcXFxcJykgJiYgbWVzc2FnZS5jaGFyQXQoMSkuaW5jbHVkZXMoJ24nKSAmJiBtZXNzYWdlLmxlbmd0aCA9PT0gMikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG5cbn1cbiIsIlxuXG5mdW5jdGlvbiBtZW1vcnkocm93cyxjb2xzLCBjb250YWluZXIpIHtcbiAgbGV0IGNhbnRUdXJuID0gZmFsc2U7XG4gIGxldCBzY29yZSA9IDA7XG4gIGxldCB0aWxlcyA9IHRpbGVBcnJheShyb3dzLCBjb2xzKTtcbiAgbGV0IGludGVydmFsO1xuICBsZXQgYXR0ZW1wdHMgPSAwO1xuICBsZXQgdHVybmVkID0gZmFsc2U7XG4gIGxldCByb3VuZE9uZTtcbiAgbGV0IHJvdW5kVHdvO1xuICBsZXQgYTtcbiAgbGV0IHRhcmdldDtcbiAgbGV0IHRlbXBsYXRlRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI21lbW9yeVRlbXAnKVswXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlRGl2LCBmYWxzZSk7XG5cbiAgdGlsZXMuZm9yRWFjaChmdW5jdGlvbiAodGlsZSwgaSkge1xuXG4gICAgYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGVEaXYuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpOyAgICAgLy8gcXVlc3Rpb24gaW1hZ2VcblxuICAgIGEuZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWJyaWNrTnVtYmVyJywgaSk7XG4gICAgYS5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc0xpc3QuYWRkKCdhVGlsZScpO1xuXG5cbiAgICBpZiAoaSAlIGNvbHMgPT09IDApIHtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgICB9XG4gICAgZGl2LmFwcGVuZENoaWxkKGEpO1xuICB9KTtcblxuXG4gIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgaWYoY2FudFR1cm4pXG4gICAgICByZXR1cm47XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGFyZ2V0ID0gY2hlY2tFdmVudFRhcmdldChldmVudCwgdGFyZ2V0KTtcbiAgICBsZXQgaSA9IHBhcnNlSW50KHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYnJpY2tOdW1iZXInKSk7XG5cbiAgICByb3VuZE9uZSA9IHtcbiAgICAgIGltYWdlVGlsZTogdGFyZ2V0LFxuICAgICAgd2hhdEltYWdlOiB0aWxlc1tpXSxcbiAgICAgIGluZGV4OiBpXG4gICAgfTtcblxuICAgIGxldCBwYXRoID0gJ2ltYWdlLycgKyByb3VuZE9uZS53aGF0SW1hZ2UgKyAnLnBuZyc7XG4gICAgdGFyZ2V0LnNyYyA9IHBhdGg7ICAgICAgLy8gdHVybiB0aWxlXG5cbiAgICBpZiAodHVybmVkKSB7ICAgICAgIC8vIHR1cm4gc2Vjb25kIHRpbGVcbiAgICAgIGlmIChyb3VuZE9uZS5pbmRleCAhPSByb3VuZFR3by5pbmRleCkge1xuICAgICAgICB0dXJuZWQgPSBmYWxzZTtcbiAgICAgICAgYXR0ZW1wdHMgKz0gMTtcbiAgICAgICAgaWYgKHJvdW5kT25lLndoYXRJbWFnZSA9PT0gcm91bmRUd28ud2hhdEltYWdlKSB7ICAgICAgICAvLyBjaGVjayBpZiBzYW1lIHRpbGVcbiAgICAgICAgICByZW1vdmVUaWxlcyhyb3VuZE9uZS5pbWFnZVRpbGUsIHJvdW5kVHdvLmltYWdlVGlsZSxpbnRlcnZhbCk7XG4gICAgICAgICAgc2NvcmUgKz0gMTtcbiAgICAgICAgICBpZiAoc2NvcmUgPT09ICgocm93cyAqIGNvbHMpIC8gMikpIHtcbiAgICAgICAgICAgIGxldCB5b3VXb25MYWJlbFRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWluaW1pemVUZW1wJyk7XG4gICAgICAgICAgICBsZXQgeW91V29uTGFiZWwgPSBkb2N1bWVudC5pbXBvcnROb2RlKHlvdVdvbkxhYmVsVGVtcC5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICAgICAgICAgIHlvdVdvbkxhYmVsLmNsYXNzTGlzdC5hZGQoJ21pZGRsZScpO1xuICAgICAgICAgICAgeW91V29uTGFiZWwudGV4dENvbnRlbnQgPSAnWW91IHdvbiBvbiAnICsgYXR0ZW1wdHMgKyAnIHRyaWVzISc7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoeW91V29uTGFiZWwpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdSB3b24gb24gJyArIGF0dGVtcHRzICsgJyB0cmllcyEnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgICAgICAgLy8gbm90IHRoZSBzYW1lLCB0dXJuIGJhY2tcbiAgICAgICAgICBjYW50VHVybj10cnVlO1xuXG4gICAgICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCdzcmMnLCAnaW1hZ2UvMC5wbmcnKTtcbiAgICAgICAgICAgIHJvdW5kVHdvLmltYWdlVGlsZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICdpbWFnZS8wLnBuZycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUdXJuIHRpbGVzIGJhY2shXCIpO1xuICAgICAgICAgICAgY2FudFR1cm4gPSBmYWxzZTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXG4gICAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbHNlIHsgICAvLyB0dXJuZWQgb25lIHRpbGVcbiAgICAgIHR1cm5lZCA9IHRydWU7XG4gICAgICByb3VuZFR3byA9IHJvdW5kT25lO1xuICAgIH1cbiAgfSk7XG4gIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYXBwJykuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuXG5cbmZ1bmN0aW9uIHJlbW92ZVRpbGVzKG5ld1RpbGUsIHJlbWVtYmVyVGlsZSxpbnRlcnZhbCl7XG5cbiAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgIG5ld1RpbGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdyZW1vdmUnKTtcbiAgICByZW1lbWJlclRpbGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdyZW1vdmUnKTtcbiAgICBjb25zb2xlLmxvZygnUGFpciBmb3VuZCEhJyk7XG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gIH0sIDUwKTtcblxuXG59XG5cbmZ1bmN0aW9uIHNodWZmbGUoYSkge1xuICBsZXQgaiwgeCwgcDtcbiAgZm9yIChwID0gYS5sZW5ndGg7IHA7IHAtLSkge1xuICAgIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwKTtcbiAgICB4ID0gYVtwIC0gMV07XG4gICAgYVtwIC0gMV0gPSBhW2pdO1xuICAgIGFbal0gPSB4O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRpbGVBcnJheShyb3dzLGNvbHMpe1xuXG4gIGxldCBhcnIgPSBbXTtcbiAgZm9yKGxldCBxID0gMTsgcTw9KHJvd3MqY29scykvMjsgcSs9MSl7XG4gICAgYXJyLnB1c2gocSk7XG4gICAgYXJyLnB1c2gocSk7XG4gIH1cbiAgc2h1ZmZsZShhcnIpO1xuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBjaGVja0V2ZW50VGFyZ2V0KGV2ZW50LCB0YXJnZXQpe1xuXG4gIGlmICghKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lNRycpKVxuICAgIHRhcmdldCA9IGV2ZW50LnRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgZWxzZVxuICAgIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgcmV0dXJuIHRhcmdldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZW1vcnk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbW92ZVdpbmRvdzogbW92ZVdpbmRvd1xufVxuXG5cblxuZnVuY3Rpb24gbW92ZVdpbmRvdyhkaXYpe1xuXG5cblxuICBsZXQgY29yZHMgPSB7XG4gICAgeEN1cnNvcjogMCxcbiAgICB5Q3Vyc29yOiAwLFxuICAgIHhXaW5kb3c6IDAsXG4gICAgeVdpbmRvdzogMFxuICB9O1xuXG4gIGxldCBzZWxlY3RlZCA9IG51bGw7XG5cbiAgbGV0IGRpdkRyYWcgPSBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cblxuXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJyxmdW5jdGlvbihlKXtcblxuXG4gICAgY29yZHMueEN1cnNvciA9IGRvY3VtZW50LmFsbCA/IHdpbmRvdy5ldmVudC5jbGllbnRYIDogZS5wYWdlWDtcbiAgICBjb3Jkcy55Q3Vyc29yID0gZG9jdW1lbnQuYWxsID8gd2luZG93LmV2ZW50LmNsaWVudFkgOiBlLnBhZ2VZO1xuICAgIGlmIChzZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgc2VsZWN0ZWQuc3R5bGUubGVmdCA9IChjb3Jkcy54Q3Vyc29yIC0gY29yZHMueFdpbmRvdykgKyAncHgnO1xuICAgICAgc2VsZWN0ZWQuc3R5bGUudG9wID0gKGNvcmRzLnlDdXJzb3IgLSBjb3Jkcy55V2luZG93KSArICdweCc7XG4gICAgfVxuICAgIH0pO1xuXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsZnVuY3Rpb24oZSl7XG4gICAgc2VsZWN0ZWQgPSBudWxsO1xuXG4gIH0pO1xuXG5cbiAgZGl2RHJhZy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLGZ1bmN0aW9uKCl7XG5cbiAgICBzZWxlY3RlZCA9IGRpdjtcbiAgICBjb3Jkcy54V2luZG93ID0gY29yZHMueEN1cnNvciAtIHNlbGVjdGVkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG4gICAgY29yZHMueVdpbmRvdyA9IGNvcmRzLnlDdXJzb3IgLSBzZWxlY3RlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gIH0pO1xuXG4gIHJldHVybiBkaXY7XG5cbn1cblxuIiwibGV0IG1vdmVXaW5kb3cgPSByZXF1aXJlKCcuL01vdmVXaW5kb3cnKTtcbmxldCBidWlsZGluZ1dpbmRvdyA9IHJlcXVpcmUoJy4vYnVpbGRpbmdXaW5kb3cnKTtcbmxldCBidWlsZGluZ01lbW9yeSA9IHJlcXVpcmUoJy4vYnVpbGRpbmdNZW1vcnknKTtcbmxldCBidWlsZGluZ0NoYXQgPSByZXF1aXJlKCcuL2J1aWxkaW5nQ2hhdCcpO1xubGV0IFVzZXJuYW1lID0gcmVxdWlyZSgnLi9sb2NhbFN0b3JhZ2UnKTtcbmxldCBidWlsZGluZ1doYWNrRGlnID0gcmVxdWlyZSgnLi9idWlsZGluZ1doYWNrJyk7XG5sZXQgTWVtb3J5ID0gcmVxdWlyZSgnLi9NZW1vcnknKTtcblxuXG5sZXQgbWVtb3J5ID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtZW1vcnknKTtcbmxldCBjaGF0ID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGF0Jyk7XG5sZXQgd2hhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2hhY2t1bGF0b3InKTtcblxubGV0IG1pbmltaXpldGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtaW5pbWl6ZUxpc3RUZW1wJyk7XG5sZXQgZGl2VGVtcE1lbSA9IGRvY3VtZW50LmltcG9ydE5vZGUobWluaW1pemV0ZW1wLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xubGV0IGRpdlRlbXBDaGF0ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtaW5pbWl6ZXRlbXAuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5sZXQgZGl2VGVtcFdoYWNrID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtaW5pbWl6ZXRlbXAuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbmRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVMaXN0JylbMF0uYXBwZW5kQ2hpbGQoZGl2VGVtcE1lbSk7XG5kb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51TGlzdCcpWzFdLmFwcGVuZENoaWxkKGRpdlRlbXBDaGF0KTtcbmRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVMaXN0JylbMl0uYXBwZW5kQ2hpbGQoZGl2VGVtcFdoYWNrKTtcblxuXG5cbm1lbW9yeS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblxuICBsZXQgd2hhdEtpbmQgPSB7XG4gICAgMDogJ01lbW9yeSdcbiAgfTtcbiAgbGV0IG1lbW9yeURpdiA9IGJ1aWxkaW5nV2luZG93LmJ1aWxkaW5nV2luZG93KHdoYXRLaW5kKTtcbiAgbWVtb3J5RGl2ID0gbW92ZVdpbmRvdy5tb3ZlV2luZG93KG1lbW9yeURpdik7XG4gIGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI2FwcHNDb250YWluZXInKS5hcHBlbmRDaGlsZChtZW1vcnlEaXYpO1xuXG59KTtcblxuXG5jaGF0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgbGV0IHdoYXRLaW5kID0ge1xuICAgIDE6ICdDaGF0J1xuICB9O1xuICBsZXQgY2hhdERpdiA9IGJ1aWxkaW5nV2luZG93LmJ1aWxkaW5nV2luZG93KHdoYXRLaW5kKTtcblxuICBjaGF0RGl2ID0gbW92ZVdpbmRvdy5tb3ZlV2luZG93KGNoYXREaXYpO1xuICBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNhcHBzQ29udGFpbmVyJykuYXBwZW5kQ2hpbGQoY2hhdERpdik7XG5cbiAgIGNoYXREaXYgPSBidWlsZGluZ0NoYXQuYnVpbGRpbmdTdGFydFVwQ2hhdChjaGF0RGl2KTtcblxuXG59KTtcblxuXG53aGFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gIGxldCB3aGF0S2luZCA9IHtcbiAgICAyOiAnV2Fja0FEaWcnXG4gIH07XG4gIGxldCB3aGFja0RpdiA9IGJ1aWxkaW5nV2luZG93LmJ1aWxkaW5nV2luZG93KHdoYXRLaW5kKTtcbiAgd2hhY2tEaXYgPSBtb3ZlV2luZG93Lm1vdmVXaW5kb3cod2hhY2tEaXYpO1xuXG4gIHdoYWNrRGl2ID0gYnVpbGRpbmdXaGFja0RpZy5idWlsZGluZ1doYWNrRGlnKHdoYWNrRGl2KTtcbiAgZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjYXBwc0NvbnRhaW5lcicpLmFwcGVuZENoaWxkKHdoYWNrRGl2KTtcblxuXG59KTtcbiIsImxldCB3ZWJTb2NrZXQgPSByZXF1aXJlKCcuL3dlYlNvY2tldCcpO1xubGV0IFVzZXJuYW1lID0gcmVxdWlyZSgnLi9sb2NhbFN0b3JhZ2UnKTtcbmxldCBsb2NhbFN0b3JhZ2UgPSByZXF1aXJlKCcuL2xvY2FsU3RvcmFnZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYnVpbGRpbmdDaGF0OiBidWlsZGluZ0NoYXQsXG4gIGJ1aWxkaW5nU3RhcnRVcENoYXQ6IGJ1aWxkaW5nU3RhcnRVcENoYXRcbn1cblxuXG5mdW5jdGlvbiBidWlsZGluZ0NoYXQoZGl2LHVzZXJuYW1lLHVzZXJuYW1lTGFiZWwpe1xuXG5cbiAgZGl2LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZCh1c2VybmFtZUxhYmVsKTtcblxuICBsZXQgdGVtcGxhdGVJbnB1dFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY2hhdENvbnRhaW5lciB0ZW1wbGF0ZScpWzBdO1xuICBsZXQgY2hhdFRvb2xzID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZUlucHV0VGV4dC5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgbGV0IGNoYXRXaW5kb3cgPSBjaGF0VG9vbHMuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIGxldCBpbnB1dFRleHQgPSBjaGF0VG9vbHMuZmlyc3RFbGVtZW50Q2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICBsZXQgc2VuZEJ1dHRvbiA9IGlucHV0VGV4dC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIGRpdi5sYXN0RWxlbWVudENoaWxkLmFwcGVuZENoaWxkKGNoYXRUb29scyk7LypcbiAgZGl2Lmxhc3RFbGVtZW50Q2hpbGQuYXBwZW5kQ2hpbGQoc2VuZEJ1dHRvbik7XG4gIGRpdi5sYXN0RWxlbWVudENoaWxkLmFwcGVuZENoaWxkKGlucHV0VGV4dCk7Ki9cblxuICBkaXYgPSB3ZWJTb2NrZXQud2ViU29ja2V0KGRpdixzZW5kQnV0dG9uLGlucHV0VGV4dCx1c2VybmFtZSk7XG5cbiAgcmV0dXJuIGRpdjtcblxufVxuXG5mdW5jdGlvbiBidWlsZGluZ1N0YXJ0VXBDaGF0KGNoYXREaXYpe1xuXG4gIGNoYXREaXYuY2xhc3NMaXN0LmFkZCgnY2hhdEFwcCcpO1xuXG4gIGxldCB0ZW1wbGF0ZUlucHV0VGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VyTmFtZVRlbXAnKTtcbiAgbGV0IHRlbXBEaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlSW5wdXRUZXh0LmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICBsZXQgdXNlck5hbWVJbnB1dCA9IHRlbXBEaXYuZmlyc3RFbGVtZW50Q2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICBsZXQgaW1hZ2VUZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ljb25zJyk7XG4gIGxldCBpY29uID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShpbWFnZVRlbXAuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gIGNoYXREaXYuZmlyc3RFbGVtZW50Q2hpbGQuYXBwZW5kQ2hpbGQoaWNvbik7XG4gIGlmIChVc2VybmFtZS5nZXRVc2VybmFtZSgpICE9IG51bGwpIHtcbiAgICBsZXQgbmFtZUJ1dHRvbiA9IHRlbXBEaXYucXVlcnlTZWxlY3RvckFsbCgnLnN0YXJ0Q2hhdCcpWzFdO1xuICAgIG5hbWVCdXR0b24udGV4dENvbnRlbnQgPSBVc2VybmFtZS5nZXRVc2VybmFtZSgpLlVzZXJuYW1lO1xuXG5cbiAgfVxuXG4gIGlmKGxvY2FsU3RvcmFnZS5nZXRVc2VybmFtZSgpID09IG51bGwpIHtcbiAgICB0ZW1wRGl2LnJlbW92ZUNoaWxkKHRlbXBEaXYucXVlcnlTZWxlY3RvcignI3N0YXJ0Q2hhdDInKSk7XG4gICAgY29uc29sZS5sb2coJ2Z1bmthYWFhcnJycnIhISEnKTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRVc2VybmFtZSgpKTtcblxuXG4gIGNoYXREaXYucXVlcnlTZWxlY3RvcignLmFwcCcpLmFwcGVuZENoaWxkKHRlbXBEaXYpO1xuXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZW1wRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGFydENoYXQnKS5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGxldCB0ZW1wRGl2QnV0dG9uID0gdGVtcERpdi5xdWVyeVNlbGVjdG9yQWxsKCcuc3RhcnRDaGF0JylbaV07XG4gICAgdGVtcERpdkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IHVzZXJuYW1lO1xuICAgICAgaWYgKGV2ZW50LnRhcmdldC5pZC50b1N0cmluZygpID09PSAnc3RhcnRDaGF0MScpXG4gICAgICAgIHVzZXJuYW1lID0gdXNlck5hbWVJbnB1dC52YWx1ZTtcbiAgICAgIGVsc2VcbiAgICAgICAgdXNlcm5hbWUgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XG5cblxuICAgICAgVXNlcm5hbWUuc2F2ZVVzZXJuYW1lKHVzZXJuYW1lKTtcblxuICAgICAgbGV0IHVzZXJuYW1lTGFiZWwgPSB0ZW1wRGl2LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgICBjaGF0RGl2LnF1ZXJ5U2VsZWN0b3IoJy5hcHAnKS5yZW1vdmVDaGlsZCh0ZW1wRGl2KTtcblxuICAgICAgY2hhdERpdiA9IGJ1aWxkaW5nQ2hhdChjaGF0RGl2LCB1c2VybmFtZSwgdXNlcm5hbWVMYWJlbCk7XG5cblxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBjaGF0RGl2O1xuXG59XG4iLCJsZXQgbWVtb3J5ID0gcmVxdWlyZSgnLi9NZW1vcnknKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYnVpbGRpbmdNZW1vcnk6IGJ1aWxkaW5nTWVtb3J5XG59XG5cbmxldCBjb3VudGVyID0gMDtcblxuZnVuY3Rpb24gYnVpbGRpbmdNZW1vcnkoZGl2KXtcblxuICBkaXYuY2xhc3NMaXN0LmFkZCgnbWVtb3J5QXBwJyk7XG5cbiAgbGV0IHRlbXBsYXRlRHJvcERvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZHJvcERvd25NZW51Jyk7XG4gIGxldCBkcm9wRG93biA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGVEcm9wRG93bi5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgbGV0IGNoaWxkTm9kZXMgPSBkcm9wRG93bi5sYXN0RWxlbWVudENoaWxkLmNoaWxkTm9kZXM7XG4gIGRpdi5maXJzdEVsZW1lbnRDaGlsZC5uZXh0RWxlbWVudFNpYmxpbmcuYXBwZW5kQ2hpbGQoZHJvcERvd24pO1xuICBsZXQgbmV3TWVtb3J5RGl2ID0gbWVtb3J5KDQsNCxkaXYpO1xuXG4gIGxldCBpbWFnZVRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaWNvbnMnKTtcbiAgbGV0IGljb24gPSBkb2N1bWVudC5pbXBvcnROb2RlKGltYWdlVGVtcC5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZywgdHJ1ZSk7XG4gIGljb24uY2xhc3NMaXN0LmFkZCgnYVRpbGUnKTtcbiAgZGl2LmZpcnN0RWxlbWVudENoaWxkLmFwcGVuZENoaWxkKGljb24pO1xuXG5cbiAgZm9yKGxldCBpID0gMDsgaTxjaGlsZE5vZGVzLmxlbmd0aDtpKz0xKXtcbiAgICBjaGlsZE5vZGVzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBhcHAgPSBuZXdNZW1vcnlEaXYucXVlcnlTZWxlY3RvcignLmFwcCcpO1xuICAgICAgYXBwLnJlbW92ZUNoaWxkKGFwcC5maXJzdEVsZW1lbnRDaGlsZCk7XG5cblxuICAgICAgbGV0IGxhYmVsVmFsdWUgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XG4gICAgICBsZXQgcm93cyA9IGxhYmVsVmFsdWUuY2hhckF0KDApO1xuICAgICAgY29uc29sZS5sb2coJ3Jvd3M6JyArIHJvd3MpO1xuICAgICAgbGV0IGNvbHMgPSBsYWJlbFZhbHVlLmNoYXJBdCgyKTtcbiAgICAgIGNvbnNvbGUubG9nKCdjb2xzOicgKyBjb2xzKTtcblxuICAgICAgbWVtb3J5KHJvd3MsY29scyxuZXdNZW1vcnlEaXYpO1xuICAgIH0pO1xuICB9XG5cblxuICBjb3VudGVyKz0xO1xuXG4gIHJldHVybiBuZXdNZW1vcnlEaXY7XG5cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJ1aWxkaW5nV2hhY2tEaWc6YnVpbGRpbmdXaGFja0RpZ1xufTtcblxuXG5mdW5jdGlvbiBidWlsZG5pZ1N0YXJ0VXBEaWcoKXtcblxufVxuXG5cbmZ1bmN0aW9uIGJ1aWxkaW5nV2hhY2tEaWcod2hhY2tEaXYpIHtcbiAgbGV0IGRyYWdCYXIgPSB3aGFja0Rpdi5maXJzdEVsZW1lbnRDaGlsZDtcbiAgbGV0IGljb25UZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ljb25zJyk7XG4gIGxldCBpY29uID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShpY29uVGVtcC5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZy5uZXh0RWxlbWVudFNpYmxpbmcsIHRydWUpO1xuICBkcmFnQmFyLmFwcGVuZENoaWxkKGljb24pO1xuICBsZXQgbnVtYmVyQXJyYXkgPSBbXTtcbiAgbGV0IG1vbGVDb3VudGVyPTA7XG4gIGxldCBsYWJlbFRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWluaW1pemVUZW1wJyk7XG4gIGxldCB0aW1lTGFiZWwgPSBkb2N1bWVudC5pbXBvcnROb2RlKGxhYmVsVGVtcC5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgbGV0IHBvaW50c0xhYmVsID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShsYWJlbFRlbXAuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gIHRpbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdkaWdsZXR0TGFiZWwnKTtcbiAgcG9pbnRzTGFiZWwuY2xhc3NMaXN0LmFkZCgnZGlnbGV0dExhYmVsJyk7XG4gIHBvaW50c0xhYmVsLnRleHRDb250ZW50ID0gJ0RpZ2xldHRzIHdhY2tlZDogJyArIDA7XG4gIGxldCBtZW51QmFyID0gd2hhY2tEaXYuZmlyc3RFbGVtZW50Q2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICBtZW51QmFyLmFwcGVuZENoaWxkKHRpbWVMYWJlbCk7XG4gIG1lbnVCYXIuYXBwZW5kQ2hpbGQocG9pbnRzTGFiZWwpO1xuICBsZXQgYXBwID0gbWVudUJhci5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIGxldCBzZWNvbmRzID0gMjA7XG4gIGxldCB0aW1lQ291bnQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXG4gICAgaWYoc2Vjb25kcyA9PT0gMCl7XG4gICAgICBjbGVhckludGVydmFsKHRpbWVDb3VudCk7XG4gICAgICBudW1iZXJBcnJheSA9IG51bGw7XG4gICAgICB3aGlsZShhcHAuZmlyc3RDaGlsZClcbiAgICAgICAgYXBwLnJlbW92ZUNoaWxkKGFwcC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzZWNvbmRzIC09IDE7XG4gICAgICB0aW1lTGFiZWwudGV4dENvbnRlbnQgPSAnVGltZTogJyArIHNlY29uZHM7XG4gICAgfVxuXG4gIH0sICgxMDAwKSk7XG5cblxuXG4gIGZvcihsZXQgaSA9IDE7aTwxNztpKz0xKSB7XG4gICAgbGV0IGJ1dHRvblRlbXBwbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvbmVUb05pbmVUZW1wJyk7XG4gICAgbGV0IGltYWdlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShidXR0b25UZW1wcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ251bWJlcicsaSk7XG4gICAgbnVtYmVyQXJyYXkucHVzaChpbWFnZSk7XG4gICAgd2hhY2tEaXYucXVlcnlTZWxlY3RvcignLmFwcCcpLmFwcGVuZENoaWxkKG51bWJlckFycmF5W2ktMV0pO1xuICAgIGlmKGklND09PTApe1xuICAgICAgd2hhY2tEaXYucXVlcnlTZWxlY3RvcignLmFwcCcpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICAgIH1cbiAgICB0aW1lSW50ZXJ2YWwobnVtYmVyQXJyYXlbaS0xXSxpLHdoYWNrRGl2KTtcblxuICB9XG5cbiAgd2hhY2tEaXYucXVlcnlTZWxlY3RvcignLmFwcCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgIGlmKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSE9J2ltYWdlJylcbiAgICAgIHJldHVybjtcblxuXG4gICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ251bWJlcicpO1xuICAgIHRhcmdldCA9IG51bWJlckFycmF5W3RhcmdldC0xXTtcblxuICAgIGlmKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGFuZ2VDb2xvcicpKVxuICAgICAgcmV0dXJuO1xuXG5cbiAgICBtb2xlQ291bnRlcis9MTtcbiAgICBwb2ludHNMYWJlbC50ZXh0Q29udGVudCA9ICdEaWdsZXR0cyB3YWNrZWQ6ICcgKyBtb2xlQ291bnRlcjtcblxuXG5cbiAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnY2hhbmdlQ29sb3InKTtcbiAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCdzcmMnICwgJy4vaW1hZ2UvZGlnbGV0dFNtYXNoZWQucG5nJyk7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3dhY2tlZCcpO1xuXG4gICAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCd3YWNrZWQnKTtcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgIH0sICgxMDApKTtcblxuXG4gIH0pO1xuXG5cblxuXG4gIHJldHVybiB3aGFja0RpdjtcblxufVxuXG5mdW5jdGlvbiB0aW1lSW50ZXJ2YWwobW9sZSxpLHdoYWNrRGl2KXtcblxuXG5cbiAgbGV0IHJhbmRvbU51bWJlcjtcblxuICBpZihtb2xlLmNsYXNzTGlzdC5jb250YWlucygnY2hhbmdlQ29sb3InKSlcbiAgICByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMjAwMCkgKyAxMDAwKTtcbiAgZWxzZVxuICAgIHJhbmRvbU51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAyMDAwKTtcblxuICBsZXQgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgIGlmKCF3aGFja0Rpdi5xdWVyeVNlbGVjdG9yQWxsKCcuYXBwJylbMF0uZmlyc3RDaGlsZCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vbGUuY2xhc3NMaXN0LnRvZ2dsZSgnY2hhbmdlQ29sb3InKTtcblxuICAgIGlmKG1vbGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGFuZ2VDb2xvcicpKVxuICAgICAgbW9sZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ltYWdlL2ljb25EaWdsZXR0LnBuZycpO1xuICAgIGVsc2VcbiAgICAgIG1vbGUuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pbWFnZS9kaWdsZXR0SG9sZS5wbmcnKTtcbiAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcblxuICAgIHRpbWVJbnRlcnZhbChtb2xlLGksd2hhY2tEaXYpO1xuICB9LCAocmFuZG9tTnVtYmVyKSk7XG5cbn1cbiIsImxldCBidWlsZGluZ01lbW9yeSA9IHJlcXVpcmUoJy4vYnVpbGRpbmdNZW1vcnknKTtcbmxldCBidWlsZGluZ0NoYXQgPSByZXF1aXJlKCcuL2J1aWxkaW5nQ2hhdCcpO1xubGV0IHdlYlNvY2tldCA9IHJlcXVpcmUoJy4vd2ViU29ja2V0Jyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJ1aWxkaW5nV2luZG93OiBidWlsZGluZ1dpbmRvd1xufTtcblxuXG5cbmZ1bmN0aW9uIGJ1aWxkaW5nV2luZG93KHR5cGUpe1xuXG4gIGxldCB0ZW1wbGF0ZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wbGF0ZScpO1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZURpdi5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgbGV0IGRpdkRyYWcgPSBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIGxldCBjbG9zZUJ1dHRvbiA9IGRpdkRyYWcuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIGxldCBtaW5pQnV0dG9uID0gY2xvc2VCdXR0b24ubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG5cbiAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNhcHBzQ29udGFpbmVyJykucmVtb3ZlQ2hpbGQoZGl2KTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB9KTtcblxuICBtaW5pQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbiAoZXZlbnQpIHtcblxuXG4gICAgbGV0IG1pbmltaXpldGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtaW5pbWl6ZVRlbXAnKTtcbiAgICBsZXQgbGkgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1pbmltaXpldGVtcC5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICBsZXQgbGFiZWwgPSBsaS5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIGxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbiAoZXZlbnQpIHtcblxuXG4gICAgICBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnbWluaW1pemVkJyk7XG4gICAgICAvLyAgbWluaUJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGVcbiAgICAgIGxldCBsaXN0ID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgIGNvbnNvbGUubG9nKGxpc3QuY2hpbGRFbGVtZW50Q291bnQpO1xuICAgICAgaWYoKGxpc3QuY2hpbGRFbGVtZW50Q291bnQtMSkgPT09IDApe1xuICAgICAgICBjb25zb2xlLmxvZygndGFyIGJvcnQgaG92ZXIgZWZmZWt0Jyk7XG4gICAgICAgIGxhYmVsLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbWVudUJhckhvdmVyJyk7XG4gICAgICB9XG4gICAgICBsaXN0LnJlbW92ZUNoaWxkKGxpKTtcbiAgICB9KTtcblxuICAgIGxhYmVsLnRleHRDb250ZW50ID0gdHlwZVtPYmplY3Qua2V5cyh0eXBlKVswXV07XG5cbiAgICBsZXQgbWVtQnV0dG9uID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yQWxsKCcubWVudUxpc3QnKVtPYmplY3Qua2V5cyh0eXBlKVswXV07XG4gICAgbWVtQnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJy5kcm9wbWVudWxvbCcpLmFwcGVuZENoaWxkKGxpKTtcbiAgICBtZW1CdXR0b24uY2xhc3NMaXN0LmFkZCgnbWVudUJhckhvdmVyJyk7XG5cblxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdtaW5pbWl6ZWQnKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB9KTtcblxuXG5cbiAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNhcHBzQ29udGFpbmVyJykuaW5zZXJ0QmVmb3JlKGRpdiwgZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjYXBwc0NvbnRhaW5lcicpLmxhc3RFbGVtZW50Q2hpbGQubmV4dFNpYmxpbmcpO1xuXG5cbiAgfSk7XG5cbiAgaWYodHlwZVswXSA9PT0gJ01lbW9yeScpXG4gICAgcmV0dXJuIGJ1aWxkaW5nTWVtb3J5LmJ1aWxkaW5nTWVtb3J5KGRpdik7XG4gIGVsc2UgaWYodHlwZVsxXSA9PT0gJ0NoYXQnKVxuICAgIHJldHVybiBkaXY7XG4gIGVsc2UgaWYgKHR5cGVbMl0gPT09ICdXYWNrQURpZycpIHtcbiAgICByZXR1cm4gZGl2O1xuICB9XG5cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNhdmVVc2VybmFtZTogc2F2ZVVzZXJuYW1lLFxuICBnZXRVc2VybmFtZTogZ2V0VXNlcm5hbWVcbn1cblxuZnVuY3Rpb24gc2F2ZVVzZXJuYW1lKG5pY2spIHtcblxuICBsZXQgdXNlcm5hbWUgPSB7XG4gICAgVXNlcm5hbWU6IG5pY2tcbiAgfTtcblxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVXNlcm5hbWUnLCBKU09OLnN0cmluZ2lmeSh1c2VybmFtZSkpO1xuXG59XG5cbmZ1bmN0aW9uIGdldFVzZXJuYW1lKCkge1xuICBsZXQgbGFzdFVzZXJuYW1lID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVXNlcm5hbWUnKSk7XG4gIHJldHVybiBsYXN0VXNlcm5hbWU7XG59XG5cblxuIiwibGV0IGVycm9ySGFuZGxpbmcgPSByZXF1aXJlKCcuL0Vycm9ySGFuZGxpbmcnKTtcbmxldCBVc2VybmFtZSA9IHJlcXVpcmUoJy4vbG9jYWxTdG9yYWdlJyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgd2ViU29ja2V0OiB3ZWJTb2NrZXQsXG4gIGNsb3NlU29ja2V0OiB3ZWJTb2NrZXQuY2xvc2VTb2NrZXRcbn1cblxuXG5cbmZ1bmN0aW9uIHdlYlNvY2tldChkaXYsc2VuZEJ1dHRvbixpbnB1dFRleHQsdXNlcm5hbWUpIHtcblxuICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhcmNvcmRzXCIpO1xuXG5cbiAgZGl2LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZUJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbiAoKSB7XG4gICAgc29ja2V0LmNsb3NlKCk7XG4gIH0pO1xuXG5cbiAgbGV0IGJhY2tncm91bmRDb2xvciA9IGZhbHNlO1xuICBsZXQgYXBwID0gZGl2O1xuICBsZXQgc2Nyb2xsV2luZG93ID0gYXBwLnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGxDaGF0Jyk7XG4gIGxldCBidXR0b24gPSBzZW5kQnV0dG9uO1xuICBsZXQgdGV4dCA9IGlucHV0VGV4dDtcblxuXG4gIGxldCBzZXR0aW5nc0JhciA9IGFwcC5maXJzdEVsZW1lbnRDaGlsZC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIGxldCB1c2VybmFtZUxhYmVsID0gc2V0dGluZ3NCYXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgbGV0IHNlbmREYXRhID0ge1xuICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgIGRhdGE6IFwiXCIsXG4gICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgIGNoYW5uZWw6IFwiVGhlIEF2ZW5nZXJzXCIsXG4gICAga2V5OiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgfTtcblxuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgYmFja2dyb3VuZENvbG9yID0gc2VuZE1lc3NhZ2Uoc2VuZERhdGEsdGV4dCxzb2NrZXQsc2Nyb2xsV2luZG93LGJhY2tncm91bmRDb2xvcik7XG4gIH0pO1xuXG5cbiAgdGV4dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgLy8gc2VuZERhdGEuZGF0YSA9IHNlbmREYXRhLmRhdGEuc3Vic3RyaW5nKHNlbmREYXRhLmRhdGEubGVuZ3RoLSlcblxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBzZW5kTWVzc2FnZShzZW5kRGF0YSwgdGV4dCwgc29ja2V0LCBzY3JvbGxXaW5kb3csIGJhY2tncm91bmRDb2xvcik7XG4gICAgICB9XG4gIH0pO1xuXG5cblxuICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IG5ld01lc3NhZ2VUZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NoYXRDb250YWluZXIgdGVtcGxhdGUnKVsxXTtcbiAgICBsZXQgcGFyYSA9IGRvY3VtZW50LmltcG9ydE5vZGUobmV3TWVzc2FnZVRlbXAuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICBsZXQgbmV3TWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgaWYobmV3TWVzc2FnZS50eXBlID09PSAnbm90aWZpY2F0aW9uJyB8fCAoKG5ld01lc3NhZ2UudHlwZSA9PSAnbWVzc2FnZScpICYmIChuZXdNZXNzYWdlLmRhdGEubGVuZ3RoPjApKSkge1xuXG4gICAgICBpZihiYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgICAgcGFyYS5jbGFzc0xpc3QuYWRkKCdzZW50VGV4dEJhY2tncm91bmQxJyk7XG4gICAgICAgIGJhY2tncm91bmRDb2xvciA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgcGFyYS5jbGFzc0xpc3QuYWRkKCdzZW50VGV4dEJhY2tncm91bmQyJyk7XG4gICAgICAgIGJhY2tncm91bmRDb2xvciA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmKG5ld01lc3NhZ2UudXNlcm5hbWUgPT09IHNlbmREYXRhLnVzZXJuYW1lKSB7XG4gICAgICAgIHBhcmEudGV4dENvbnRlbnQgPSAnTWU6ICcgKyBzZW5kRGF0YS5kYXRhO1xuICAgICAgICBwYXJhLmNsYXNzTGlzdC5hZGQoJ3NlbGZTZW50Jyk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBwYXJhLnRleHRDb250ZW50ID0gbmV3TWVzc2FnZS51c2VybmFtZSArICc6ICcgKyBuZXdNZXNzYWdlLmRhdGE7XG4gICAgICAgIHBhcmEuY2xhc3NMaXN0LmFkZCgncmVjaWV2ZWRNZXNzYWdlJyk7XG4gICAgICB9XG4gICAgICBzY3JvbGxXaW5kb3cuYXBwZW5kQ2hpbGQocGFyYSk7XG4gICAgICBzY3JvbGxXaW5kb3cuc2Nyb2xsVG9wID0gc2Nyb2xsV2luZG93LnNjcm9sbEhlaWdodDtcbiAgICB9XG5cbiAgfSk7XG5cblxuICB1c2VybmFtZUxhYmVsLnRleHRDb250ZW50ID0gdXNlcm5hbWVMYWJlbC50ZXh0Q29udGVudCArIHVzZXJuYW1lO1xuXG4gIHVzZXJuYW1lTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgdXNlcm5hbWVMYWJlbC50ZXh0Q29udGVudCA9ICdVc2VybmFtZTogJztcblxuICAgIGxldCB0ZW1wbGF0ZUlucHV0VGV4dDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXRUZXh0Jyk7XG4gICAgbGV0IGlucHV0VGV4dCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGVJbnB1dFRleHQyLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGlucHV0VGV4dC52YWx1ZSA9IHVzZXJuYW1lO1xuXG4gICAgbGV0IGJ1dHRvblRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uVGVtcCcpO1xuICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5pbXBvcnROb2RlKGJ1dHRvblRlbXAuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gJ0RvbmUnO1xuXG4gICAgbGV0IHNldHRpbmdzQmFyID0gZGl2LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZztcblxuICAgIHNldHRpbmdzQmFyLmFwcGVuZENoaWxkKGlucHV0VGV4dCk7XG4gICAgc2V0dGluZ3NCYXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgIGxldCBuZXdVc2VybmFtZSA9IGlucHV0VGV4dC52YWx1ZTtcbiAgICAgIHNldHRpbmdzQmFyLnJlbW92ZUNoaWxkKGlucHV0VGV4dCk7XG4gICAgICBzZXR0aW5nc0Jhci5yZW1vdmVDaGlsZChldmVudC50YXJnZXQpO1xuICAgICAgdXNlcm5hbWVMYWJlbC50ZXh0Q29udGVudCA9IHVzZXJuYW1lTGFiZWwudGV4dENvbnRlbnQgKyBuZXdVc2VybmFtZTtcbiAgICAgIHNlbmREYXRhLnVzZXJuYW1lID0gbmV3VXNlcm5hbWU7XG4gICAgICBVc2VybmFtZS5zYXZlVXNlcm5hbWUobmV3VXNlcm5hbWUpO1xuXG5cblxuICAgIH0pO1xuXG5cblxuXG5cblxuICB9KTtcblxuXG5cbiAgcmV0dXJuIGFwcDtcblxufVxuXG5cblxuZnVuY3Rpb24gc2VuZE1lc3NhZ2Uoc2VuZERhdGEsdGV4dCxzb2NrZXQsc2Nyb2xsV2luZG93LGJhY2tncm91bmRDb2xvcil7XG5cbiAgaWYoZXJyb3JIYW5kbGluZy52YWxpZE1lc3NhZ2UodGV4dC52YWx1ZSkpXG4gICAgcmV0dXJuO1xuXG4gIHNlbmREYXRhLmRhdGEgPSB0ZXh0LnZhbHVlO1xuICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShzZW5kRGF0YSkpO1xuICBzY3JvbGxXaW5kb3cuc2Nyb2xsVG9wID0gc2Nyb2xsV2luZG93LnNjcm9sbEhlaWdodDtcbiAgdGV4dC52YWx1ZSA9ICcnO1xuXG4gIHJldHVybiBiYWNrZ3JvdW5kQ29sb3I7XG59XG4iXX0=
