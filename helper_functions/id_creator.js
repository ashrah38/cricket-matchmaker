// A one-time use to populate the Timings collection
const mongoose = require("mongoose");
const Timings = require("../models/timings");
function IdCreator() {
  let month = "1";
  let date = "1";
  let hours = "0";

  let id = "111";
  let numDaysPerMonth = 31;
  for (k = 0; k < 12; k++) {
    for (i = 0; i < numDaysPerMonth; i++) {
      if (date >= numDaysPerMonth + 1) {
        date = "1";
      }
      // start of inner-loop
      for (j = 0; j < 24; j++) {
        hours++;
        id = "" + month + date + hours;
        let tempMonth = month;
        let tempDate = date;
        let tempHour = hours;
        if (tempMonth < 10) {
          tempMonth = "" + "0" + month;
        }
        if (tempDate < 10) {
          tempDate = "" + "0" + date;
        }
        if (tempHour < 10) {
          tempHour = "" + "0" + hours;
        }
        let idToCreate = "" + tempMonth + tempDate + tempHour;
        Timings.create({ id: idToCreate });
      } // end of inner-loop
      date++;
      hours = 0;
    } // end of outer-loop
    month++;
  } // end of month-loop
}
module.exports = IdCreator;
