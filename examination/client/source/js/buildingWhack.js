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
