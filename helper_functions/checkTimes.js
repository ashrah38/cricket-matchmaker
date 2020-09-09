// to ensure that the starttime is greater than the endtime
function checkTimes(startHour, startZone, endHour, endZone) {
  if (endZone == "am" && startZone == "pm") {
    return false;
  }
  if (endZone == "am" && startZone == "am") {
    let endHourC = parseInt(endHour);
    let startHourC = parseInt(startHour);
    if (endHourC <= startHourC) {
      return false;
    }
  }
  if (endZone == "pm" && startZone == "pm") {
    let endHourC = parseInt(endHour);
    let startHourC = parseInt(startHour);
    if (endHourC <= startHourC) {
      return false;
    }
  }
  return true;
}

module.exports = checkTimes;
