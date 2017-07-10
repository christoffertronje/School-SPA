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
