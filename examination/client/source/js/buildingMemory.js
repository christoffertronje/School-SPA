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
