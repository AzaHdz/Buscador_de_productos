const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";

  if(currentDay === 6 || currentDay === 0){
    day = "weekend";
    res.render("favoritos", {kindOfDay: day} )
  } else {
    day = "Weekday";
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
