var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var async = require('async');
var path = require("path");
var kleiDust = require('klei-dust');
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var express = require("express");
var app = express();

app.engine('dust', kleiDust.dust);
app.set('view engine', 'dust');
app.set('view options', { layout: false });

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use("/blog", express.static(path.join(__dirname, "blog", "_site")));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var session = require('express-session');

var sess = {
    secret: 'gridia rulez',
    cookie: {}
}

app.use(session(sess));
app.use(flash());

app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});

const tech = parse(fs.readFileSync("tech.csv")).map(function(row) {
    return {
        title: row[0],
        image: row[1]
    };
});

console.log(444);
app.get("/", function(req, res) {
    res.render("index", { tech });
});

app.get("/terminal", function(req, res) {
    fs.readdir('./public/terminal/', (err, fileNames) => {
        if (err) throw err;

        var files = {};

        function readAsync(fileName, callback) {
            fs.readFile("./public/terminal/" + fileName, 'utf8', function(err, content) {
                files[fileName] = content;
                callback(err);
            });
        }

        async.each(fileNames, readAsync, function(err) {
            res.send(files);
        });
    });
});

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "cjamcl@gmail.com",
        pass: "19940806CJC!"
    }
});

app.post('/contact', function(req, res) {
    var data = req.body;

    var emailBody = "Hey there! Your message found its way to my inbox. I'll respond as soon as I read it. What you wrote: " + data.message;

    smtpTransport.sendMail({ //email options
        from: "Connor Clark <cjamcl@gmail.com>",
        to: `${data.name} <${data.email}>`,
        bcc: "Connor Clark <cjamcl@gmail.com>",
        subject: "Got your message!",
        html: emailBody
    }, function(error, response) {
        if (error) {
            console.log(error);
            req.flash('error', error.toString());
            res.redirect("/");
        } else {
            console.log("Message sent: " + res.message);
            req.flash("success", 'Message sent!');
            res.redirect("/");
        }
    });
});

var port = process.env.PORT || 3001;
console.log("listening on port " + port);

app.listen(port);
