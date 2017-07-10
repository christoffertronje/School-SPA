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


