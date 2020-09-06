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
  fetch("http://localhost:3000/user/home/logout").then(
    () => (window.location = "http://localhost:3000/")
  );
});

changepassBar.addEventListener("click", () => {
  fetch("http://localhost:3000/user/changepassword").then(
    () => (window.location = "http://localhost:3000/user/changepassword")
  );
});
// END OF NAV BAR FUNCTIONS
