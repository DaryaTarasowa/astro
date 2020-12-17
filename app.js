var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
var runner = require("child_process");

var ephModule = require('./modules/eph');
var config = require('./config');


app.use(express.json({ limit: '50mb' }));       // to support JSON-encoded bodies
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })); // to support URL-encoded bodies
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));



var execPHP = require('./execphp.js')();

app.post('/natal', function(req,res,next){
    var formData = {};
    var parametres = '';
    if (req.body){
        if (req.body.dateOfBirth){
            formData.dateOfBirth =  req.body.dateOfBirth;
        }
        if (req.body.long){
            formData.longitude = req.body.long;
        }
        if (req.body.lat){
            formData.latitude = req.body.lat;
        }
        if (req.body.timeOfBirth){
            formData.timeOfBirth = req.body.timeOfBirth;
        }
        if (req.body.timeZone){
            formData.timeZone = req.body.timeZone;
        }
    }

    ephModule.getEph(formData, function(success, eph) {
        if (!success) res.render('error');
        var dataDone = {};
        dataDone['cusps'] = [];
        dataDone['planets'] = {};
        for (var i = 0; i < 12; i++){
            dataDone['cusps'].push(eph.houses.house[i]);
        }

        dataDone['planets']['Sun'] = [parseFloat(eph.sun.longitude)];
        dataDone['planets']['Moon'] = [parseFloat(eph.moon.longitude)];
        dataDone['planets']['Mercury'] = [parseFloat(eph.mercury.longitude)];
        dataDone['planets']['Venus'] = [parseFloat(eph.venus.longitude)];
        dataDone['planets']['Mars'] = [parseFloat(eph.mars.longitude)];
        dataDone['planets']['Jupiter'] = [parseFloat(eph.jupiter.longitude)];
        dataDone['planets']['Uranus'] = [parseFloat(eph.uranus.longitude)];
        dataDone['planets']['Saturn'] = [parseFloat(eph.saturn.longitude)];
        dataDone['planets']['Neptune'] = [parseFloat(eph.neptune.longitude)];
        dataDone['planets']['Pluto'] = [parseFloat(eph.pluto.longitude)];
        dataDone['planets']['NNode'] = [parseFloat(eph.true_node.longitude)];
        dataDone['planets']['Lilith'] = [parseFloat(eph.lilith.longitude)];

        res.render('index', {'data' : dataDone, 'error' :false, 'APIkey': config.googleAPIKey});

    })


})

app.get('/natal', function(req,res,next){
    res.render('index', {'data':'', 'APIkey': config.googleAPIKey, 'error':false});
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
