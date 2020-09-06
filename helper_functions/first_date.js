// returns the day on the 1st of every month
const moment = require("moment");

function getStartDay(currentYear, currentMonth) {
  const date = new Date(`${currentMonth} 1, ${currentYear}`);
  return date.getDay();
}

module.exports = getStartDay;
