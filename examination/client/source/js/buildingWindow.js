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
