// Generates the entire calendar dynamically
const moment = require("moment");
const monthDays = require("month-days");

function generateCalendar(currentMonth, startDay, currentYear) {
  const months = moment.months();
  const days = moment.weekdays();
  const month = months.indexOf(currentMonth);
  const totalDays = monthDays({ month: month, year: moment().year() });
  let html = "";
  // adding the month
  html =
    html +
    `<div class="month-box" id="">
        <h3>${currentMonth}</h3>
        <h3>${currentYear}</h3>
        <form action="/user/calendar" method="post">
          <input type="hidden" name="btn" value="next" />
          <button id="next" class="primary-btn">next</button>
        </form>
        <form action="/user/calendar" method="post">
          <input type="hidden" name="btn" value="previous" />
          <button id="previous" type="submit" class="primary-btn">previous</button>
        </form>
      </div>`;

  // adding each date and day
  for (let i = 1; i <= totalDays; i++) {
    html =
      html +
      `
          <div class="date-box" id = "${i}" >
              <h3>${i}</h3>
              <h3>${days[startDay % 7]}</h3>
              <form action="/user/calendar" method="post">
              <input type="hidden" name="date" value="${i}">
              <input type="hidden" name="day" value="${days[startDay++ % 7]}">
              <button type="submit" class = "calendar-btn" name = "btn" value = "timings">Select timings</button>
              </form>
              </div>`;
  }
  return html;
}

module.exports = generateCalendar;
