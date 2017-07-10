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

