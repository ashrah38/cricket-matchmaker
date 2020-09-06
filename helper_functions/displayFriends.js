// displays friends at the homepage
function displayFriends(friends) {
  let displayList = "";
  friends.forEach((friend) => {
    displayList += `<h3>${friend.firstName}</h3>
<h3>${friend.lastName}</h3>`;
  });
  return displayList;
}

module.exports = displayFriends;
