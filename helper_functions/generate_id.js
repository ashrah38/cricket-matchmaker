// generates ids from date, month and time.
// The id is used to locate objects in the timings collection.
const timeSlots = require("./timeSlots");
const moment = require("moment");
const months = moment.months();
function generateIds(date, month, from, to) {
  // Step one - deconstructing the times
  let idArray = [];
  let temp1 = from.split(":");
  let startHour = temp1[0];
  let temp2 = temp1[1].split(" ");
  let startMinute = temp2[0];
  let startZone = temp2[1];

  temp1 = to.split(":");
  let endHour = temp1[0];
  temp2 = temp1[1].split(" ");
  let endMinute = temp2[0];
  let endZone = temp2[1];

  let hoursAvailable = timeSlots(
    startHour,
    startMinute,
    startZone,
    endHour,
    endMinute,
    endZone
  );
  let monthId = months.indexOf(month);
  monthId = monthId + 1;
  let id = "";
  hoursAvailable.forEach((hour) => {
    id = "" + monthId + date + hour;
    let tempDate = date;
    let tempHour = hour;
    if (tempDate < 10) {
      tempDate = "" + "0" + date;
    }
    if (tempHour < 10) {
      tempHour = "" + "0" + hour;
    }
    let idToCreate = "" + monthId + tempDate + tempHour;
    idArray.push(idToCreate);
  });
  return idArray;
}
module.exports = generateIds;
