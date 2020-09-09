const findfriendsBtn = document.getElementById("findfriends");
const availabilitiesDisplay = document.getElementById("availabilities");
const scheduleDisplay = document.getElementById("schedule-display");
const urlFF = "https://evening-shore-75940.herokuapp.com/user/home/friends";
const urlDA =
  "https://evening-shore-75940.herokuapp.com/user/home/availability";
const urlGT = "https://evening-shore-75940.herokuapp.com/user/home/timings";
findfriendsBtn.addEventListener("click", (click) => {
  click.preventDefault();
  getFriends();
});

// ADD FRIEND FORM FUNCTIONALITY
const friendForm = document.getElementById("friendform");
const showfriendForm = document.getElementById("showfriendform");
const toggleBtn = document.getElementById("toggle-btn");
const smalltext = document.getElementById("smalltext");

toggleBtn.addEventListener("click", () => {
  if (friendForm.classList.contains("show-form")) {
    friendForm.classList.remove("show-form");
    showfriendForm.classList.remove("show-form");
    smalltext.innerHTML = `Add <br> Friends`;
  } else {
    friendForm.classList.add("show-form");
    showfriendForm.classList.add("show-form");
    smalltext.innerHTML = "";
    document.getElementById("friendsDisplay").innerHTML = "";
  }
});

// DROPDOWN MENU FUNCTIONALITY
const dropBtn = document.getElementById("dropdown-btn");
const dropMenu = document.getElementById("dropdown-menu");
const logoutBar = document.getElementById("logout-bar");
const changepassBar = document.getElementById("changepass-bar");

dropBtn.addEventListener("click", () => {
  if (dropMenu.classList.contains("show")) {
    dropMenu.classList.remove("show");
  } else {
    dropMenu.classList.add("show");
  }
});

logoutBar.addEventListener("click", () => {
  console.log("event registered");
  fetch("https://evening-shore-75940.herokuapp.com/user/home/logout").then(
    () => (window.location = "https://evening-shore-75940.herokuapp.com/")
  );
});

changepassBar.addEventListener("click", () => {
  fetch("https://evening-shore-75940.herokuapp.com/user/changepassword").then(
    () =>
      (window.location =
        "https://evening-shore-75940.herokuapp.com/user/changepassword")
  );
});
// END OF NAV BAR FUNCTIONS

// FUNCTION TO CONVERT ID TO WRITTEN DATE AND MONTH
function convertIdtoTime(id) {
  months = [
    "blank",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let monthId = "";
  let dayId = "";
  let hourId = "";
  let zone = "am";

  if (id.length == 5) {
    monthId = id[0];
    dayId = id.slice(1, 3);
    hourId = id.slice(3, 5);
  }
  if (id.length == 6) {
    monthId = id.slice(0, 2);
    dayId = id.slice(2, 4);
    hourId = id.slice(4, 6);
  }
  if (hourId == 12) {
    zone = "pm";
  }
  if (hourId > 12) {
    zone = "pm";
    hourId = hourId - 12;
  }
  hourId = hourId - 0;
  let month = months[monthId];
  let text = `${dayId} ${month} at ${hourId}${zone}`;
  return text;
}

// FUNCTION TO SEARCH FOR FRIENDS
function getFriends() {
  let name = document.getElementById("name").value;
  let username = document.getElementById("id").value;
  let friends = fetch(urlFF, {
    method: "POST",
    body: JSON.stringify({
      name,
      username,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((friendList) => {
      return displayFriends(friendList);
    });
}

// FUNCTION TO DISPLAY THE FRIENDS OBTAINED FROM THE SEARCH
function displayFriends(friendList) {
  let counter = 0;
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let username = document.getElementById("username");
  let displayBox = document.getElementById("friendsDisplay");
  if (friendList.length == 0) {
    return (displayBox.innerHTML += "No friends ");
  }
  friendList.forEach((element) => {
    displayBox.innerHTML += `<div class="display-box">
    <div>
    <img src="../public/assets/images/defaultdp.png" alt="" />
    </div>
    <div>
    <h3 id="firstName">${element.firstName}</h3>
    <h3 id="lastName">${element.lastName}</h3>
    <h3 id="username">${element.username}</h3>
    <input type="hidden" name="username" value="${element.username}" />
    <input type="hidden" name="firstName" value="${element.firstName}" />
    <input type="hidden" name="lastName" value="${element.lastName}" />
    <button class="addfriend-btn" type="submit">Add Friend</button>
    </div>
  </div>`;
  });
}

let filteredArray = [];
// FUNCTION TO OBTAIN FRIENDLIST AND TIMINGS FOR DYNAMIC AVAILABILITY DISPLAY
async function showAvailability() {
  let timingsArray = [];
  fetch(urlDA)
    .then((response) => response.json())
    .then((data) => {
      let friendList = data.friendList;
      let availability = data.availability;

      availability.forEach((id) => {
        filteredArray.push({ id: id, friends: [] });
        fetch(urlGT, {
          method: "POST",
          body: JSON.stringify({
            id,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            friendList.forEach((friend) => {
              if (data.people.includes(friend.username)) {
                // filteredArray.push({ id: data.id, friend });
                let x = filteredArray.find((object) => object.id == id);
                x.friends.push(friend);
              }
            });
          });
      });
    });
}
showAvailability();

function displayData() {
  filteredArray.forEach((object) => {
    let date = convertIdtoTime(object.id);
    if (object.friends.length > 0) {
      let friendhtml = ``;
      object.friends.forEach((friend) => {
        friendhtml += `<h5>${friend.firstName} ${friend.lastName}</h5>`;
      });
      availabilitiesDisplay.innerHTML += `<div class="a-single">
  <h5 class="title">${date}</h5>
  <h5 class="small-headline">The following are free to play: </h5>
  <div class="friend-names">${friendhtml}</div>
</div>`;
    }
  });
}
setTimeout(displayData, 3000);

// FUNCTION TO DISPLAY FRIEND'S SCHEDULE
function displaySchedule() {
  let usernameForSchedule = "";
  const availBtns = Array.from(document.getElementsByClassName("avail-btns"));

  availBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      let btnClicked = e.target;
      usernameForSchedule = btnClicked.id;
      let urlDS = `https://evening-shore-75940.herokuapp.com/user/home/schedule/${usernameForSchedule}`;
      fetch(urlDS, {
        method: "POST",
        body: JSON.stringify({
          username: usernameForSchedule,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())

        .then((data) => {
          scheduleDisplay.innerHTML = `<h2>${usernameForSchedule} availability</h2>`;
          data.schedule.forEach((entry) => {
            scheduleDisplay.innerHTML += `
      <div class="single-slot">
      <h4>${entry.date} ${entry.month}</h4>
      <h4>${entry.from} - ${entry.to}</h4>
      </div>`;
          });
          scheduleDisplay.innerHTML += `<button class="scroll-btn">Friend's Schedule <i class="fas fa-location-arrow updown-btn"></i></button>`;
          scheduleDisplay.classList.add("show-schedule");
          setTimeout(
            () => scheduleDisplay.classList.remove("show-schedule"),
            3000
          );
        });
    });
  });
}
displaySchedule();
