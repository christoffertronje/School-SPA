

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
