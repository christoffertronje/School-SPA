module.exports = {
  validMessage: validMessage,
};



function validMessage(message){


  console.log('message: ' + message);

  if(message.length === 0 || (message.charAt(0).includes('\\') && message.charAt(1).includes('n') && message.length === 2)) {
    return true;
  }


}
