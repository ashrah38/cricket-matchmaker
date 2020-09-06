// to ensure that the starttime is greater than the endtime
function checkTimes(startHour, startZone, endHour, endZone) {
  if (endZone == "am" && startZone == "pm") {
    return false;
  }
  if (endZone == "am" && startZone == "am") {
    if (endHour <= startHour) {
      return false;
    }
  }
  if (endZone == "pm" && startZone == "pm") {
    if (endHour <= startHour) {
      return false;
    }
  }
  return true;
}

module.exports = checkTimes;
