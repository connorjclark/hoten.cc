var path = require("path");
var kleiDust = require('klei-dust');
var express = require("express");
var app = express();

 app.engine('dust', kleiDust.dust);
app.set('view engine', 'dust');
app.set('view options', {layout: false});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.render("index");
});

app.listen(process.env.PORT || 3000);
