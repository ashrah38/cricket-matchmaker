const alertBox = document.getElementById("alert");
const errorMsg = document.getElementById("errormsg");
const content = errorMsg.innerHTML;

if (content == "") {
  alertBox.style.display = "none";
}
