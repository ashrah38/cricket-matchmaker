const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const Users = require("../models/users.js");
const Timings = require("../models/timings.js");
const connectEnsureLogin = require("connect-ensure-login");
const moment = require("moment");
const getStartDay = require("../helper_functions/first_date");
const generateCalendar = require("../helper_functions/generate_calender");
const generateIds = require("../helper_functions/generate_id");
const checkTimes = require("../helper_functions/checkTimes");
// Holding information for the timing form
let timingsDay;
let timingsDate;
let timingsMonth;
let timingsYear;
const createTimeSlot = require("../helper_functions/timeSlots");
let errorMessage = "";

// GET - Home page
router.get(
  "/home",
  connectEnsureLogin.ensureLoggedIn("/login"),
  (req, res, next) => {
    let firstName = req.user.firstName;
    let lastName = req.user.lastName;
    let friendList = req.user.friends;
    res.render("home.ejs", { firstName, friendList });
  }
);

// GET - Calendar page
router.get(
  "/calendar",
  connectEnsureLogin.ensureLoggedIn("/login"),
  (req, res, next) => {
    const currentMonth = req.user.monthAt;
    const currentYear = req.user.yearAt;
    const startDay = getStartDay(2020, currentMonth);
    const html = generateCalendar(currentMonth, startDay, currentYear);

    res.render("calendar.ejs", { html });
  }
);

// GET - Acquiring the timings form
router.get(
  "/timings",
  connectEnsureLogin.ensureLoggedIn("/login"),
  (req, res, next) => {
    res.render("timings.ejs", {
      timingsDay,
      timingsDate,
      timingsMonth,
      timingsYear,
      errorMessage,
    });
  }
);

// POST - Allowing to manipulate the calendar
router.post(
  "/calendar",
  connectEnsureLogin.ensureLoggedIn("/login"),
  (req, res, next) => {
    const months = moment.months();
    let currentMonth = req.user.monthAt;
    let currentYear = req.user.yearAt;
    let currentIndex = months.indexOf(currentMonth);
    // functionality for back-click
    if (req.body.btn == "previous") {
      if (currentIndex == 0) {
        currentIndex = 12;
        req.user.yearAt = --currentYear;
      }
      currentYear = req.user.yearAt;
      currentMonth = months[--currentIndex];
      req.user.monthAt = currentMonth;
      req.user.save();
    }
    // functionality for forward-click
    if (req.body.btn == "next") {
      if (currentIndex == 11) {
        currentIndex = -1;
        req.user.yearAt = ++currentYear;
      }
      currentYear = req.user.yearAt;
      currentMonth = months[++currentIndex];
      req.user.monthAt = currentMonth;
      req.user.save();
    }
    // functionality for the timings page
    if (req.body.btn == "timings") {
      timingsDay = req.body.day;
      timingsDate = req.body.date;
      timingsMonth = currentMonth;
      timingsYear = currentYear;
      return res.redirect("/user/timings");
    }
    const startDay = getStartDay(currentYear, currentMonth);
    const html = generateCalendar(currentMonth, startDay, currentYear);
    res.render("calendar.ejs", { html });
  }
);

// POST - submitting availability form
router.post(
  "/timings",
  connectEnsureLogin.ensureLoggedIn("/login"),
  (req, res, next) => {
    const {
      startHours,
      startMinutes,
      startZone,
      endHours,
      endMinutes,
      endZone,
      location,
    } = req.body;

    // ensuring that start time is before end time
    if (!checkTimes(startHours, startZone, endHours, endZone)) {
      errorMessage = "Ending time can't be before starting time";
      return res.render("timings.ejs", {
        timingsDay,
        timingsDate,
        timingsMonth,
        timingsYear,
        errorMessage,
      });
    }
    // creating objects to be stored for the display
    let from = `${startHours}:${startMinutes} ${startZone}`;
    let to = `${endHours}:${endMinutes} ${endZone}`;
    let scheduleDisplay = {
      from: from,
      to: to,
      date: timingsDate,
      month: timingsMonth,
    };
    let schedule = req.user.schedule;
    schedule.push(scheduleDisplay);

    // creating the array for hours available
    let hoursAvailable = createTimeSlot(
      startHours,
      startMinutes,
      startZone,
      endHours,
      endMinutes,
      endZone
    );

    req.user.save();

    // storing the timings information for comparison
    hoursAvailable.forEach((hour) => {
      let monthsArray = moment.months();
      let date = timingsDate;
      let month = monthsArray.indexOf(timingsMonth) + 1;
      let id = "" + month + date + hour;
      let tempDate = date;
      let tempHour = hour;
      if (tempDate < 10) {
        tempDate = "" + "0" + date;
      }
      if (tempHour < 10) {
        tempHour = "" + "0" + hour;
      }
      let idToStore = "" + month + tempDate + tempHour;

      // storing the id in the availability array of the person
      req.user.availability.push(idToStore);

      idToStore = parseInt(idToStore, 10);
      Timings.findOneAndUpdate(
        { id: idToStore },
        { $push: { people: req.user.username } },
        { new: true, upsert: true },
        function (err, managerparent) {
          if (err) throw err;
        }
      );
    });
    res.redirect("/user/calendar");
  }
);

// GET route sends back the schedule for the user
router.get("/calendar/schedule", (req, res, next) => {
  res.send(req.user.schedule);
});

router.post("/calendar/schedule", (req, res, next) => {
  const { from, to, date, month, id } = req.body;
  // removing the entry from the schedule array
  req.user.schedule.splice(id, 1);
  req.user.save();
  let idArray = generateIds(date, month, from, to);

  // removing the name from the timings array and availability array
  idArray.forEach((id) => {
    let index = req.user.availability.indexOf("id");
    req.user.availability.splice(index, 1);
    Timings.findOneAndUpdate(
      { id },
      { $pull: { people: req.user.username } },
      { new: true, upsert: true },
      function (err, managerparent) {
        if (err) throw err;
      }
    );
  });
});

// To change password
router.get(
  "/changepassword",
  connectEnsureLogin.ensureLoggedIn("/login"),
  async (req, res, next) => {
    res.render("changepasswordold.ejs", {
      username: req.body.username,
      token: "",
    });
  }
);

// To change password
router.post(
  "/changepassword",
  connectEnsureLogin.ensureLoggedIn("/login"),
  async (req, res, next) => {
    req.user.changePassword(req.body.oldpassword, req.body.newpassword, (err) =>
      console.log(err)
    );
    req.user.save();
  }
);

module.exports = router;
