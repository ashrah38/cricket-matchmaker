// Returns an array of hours a person is available for on a specific day
function createTimeSlot(
  startHour,
  startMinute,
  startZone,
  endHour,
  endMinute,
  endZone
) {
  let hoursAvailable = [];
  startHour = parseInt(startHour);
  endHour = parseInt(endHour);

  if (startZone == "pm") {
    startHour = startHour + 12;
  }
  if (endZone == "pm") {
    endHour = endHour + 12;
  }
  if (startMinute >= 30) {
    startHour = startHour + 1;
  }
  if (endMinute >= 40) {
    endHour = endHour + 1;
  }

  let timer = endHour - startHour;
  for (let i = 0; i <= timer; i++) {
    hoursAvailable.push(startHour++);
  }
  return hoursAvailable;
}

module.exports = createTimeSlot;
