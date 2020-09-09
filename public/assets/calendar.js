const url = "http://www.cricketmatchmaker.com/user/calendar/schedule";
const scheduleBox = document.getElementById("scheduleBox");
let closeBtns = undefined;
let cbArray = undefined;
// To display the schedule for each person
function displayTimeSlots() {
  let counter = 0;
  let schedule = fetch(url, { method: "GET" })
    .then((response) => response.json())
    .then((scheduleArray) => {
      scheduleArray.forEach((entry) => {
        scheduleBox.innerHTML += `
        <div class="single-slot" id = "${counter++}">
        <h4>${entry.date} ${entry.month}</h4>
        <h4>${entry.from} - ${entry.to}</h4>
        <i class="close-icon far fa-times-circle fa-1x" ></i>
        </div>`;
      });
      closeBtns = Array.from(document.getElementsByClassName("close-icon"));
      closeBtns.forEach((button) => {
        button.addEventListener("click", (e) => {
          let btnClicked = e.target;
          let parentDiv = btnClicked.parentNode;
          let children = parentDiv.childNodes;
          let dayInfo = children[1].innerHTML;
          let timeInfo = children[3].innerHTML;
          let tempArray = dayInfo.split(" ");
          let date = tempArray[0];
          let month = tempArray[1];
          tempArray = timeInfo.split(" - ");
          let from = tempArray[0];
          let to = tempArray[1];
          let id = parentDiv.id;
          parentDiv.remove();

          // (month, date, from, to) is all the information we need right now
          console.log("making delete request");
          fetch(url, {
            method: "POST",
            body: JSON.stringify({
              from,
              to,
              date,
              month,
              id,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((data) => console.log(data));
        });
      });
    });
}
displayTimeSlots();
