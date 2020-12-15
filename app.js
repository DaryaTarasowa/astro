var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
var runner = require("child_process");



app.use(express.json({ limit: '50mb' }));       // to support JSON-encoded bodies
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })); // to support URL-encoded bodies
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));



// var indexRouter = require('./routes/index');
// app.use('/', function(req, res, next) {
//
//
//     exec ("swetest -edir$libPath -b$date -ut$time -p0123456789DAmt -sid1 -eswe -house$longitude,$latitude,$h_sys -fPls -g, -head", output);
//     res.send('success');
// });

var data = {
	"planets":{"Moon":[0], "Sun":[45], "Mercury":[60]},
	"cusps":[300, 340, 30, 60, 75, 90, 116, 172, 210, 236, 250, 274]
};


var execPHP = require('./execphp.js')();

app.post('/natal', function(req,res,next){
    var parametres = '';
    if (req.body){
        if (req.body.dateOfBirth){
            parametres+= ' ' + req.body.dateOfBirth;
        }
        if (req.body.long){
            parametres+= ' ' + req.body.long;
        }
        if (req.body.lat){
            parametres+= ' ' + req.body.lat;
        }

    }
    execPHP.parseFile(req.originalUrl+'.php', parametres, function(success, phpResult) {
        console.log('success: ' +success +' data: ' +phpResult);
        if (success){
            var dataPhP = JSON.parse(phpResult);
            var dataDone = {};
            dataDone['planets'] = {};
            dataDone['cusps'] = [];
            for (var planet in dataPhP){
                var planetName = dataPhP[planet].split(',')[0].trim();
                if (planetName.match('house')){
                    var house = parseInt(dataPhP[planet].split(',')[1].trim());
                    dataDone['cusps'].push(house);
                }else if (planetName.match('mean') || planetName.match('true') || planetName=='Ascendant' || planetName.match('MC') || planetName =='Vertex' ){

                }else {
                    var planetAngle = dataPhP[planet].split(',')[1].trim();
                    dataDone['planets'][planetName] = [planetAngle];
                }

            }
            //console.log(dataDone);
            dataDone['cusps'] = [300, 340, 30, 60, 75, 90, 116, 172, 210, 236, 250, 274];
            res.render('index', {'data' : dataDone, 'error' :false});
    		res.end();
        }else{
            res.render('index', {'data' : {}, 'error' :true});
        }

	});

})

app.get('/natal', function(req,res,next){
    res.render('index', {'data':'', 'error':'false'});
})

// catching php files
// app.use('*.php',function(req,res,next) {
// 	execPHP.parseFile(req.originalUrl,function(phpResult) {
//         var dataPhP = JSON.parse(phpResult);
//         //console.log(dataPhP);
//         var dataDone = {};
//         dataDone['planets'] = {};
//         dataDone['cusps'] = [];
//         for (var planet in dataPhP){
//             var planetName = dataPhP[planet].split(',')[0].trim();
//             if (planetName.match('house')){
//                 var house = parseInt(dataPhP[planet].split(',')[1].trim());
//                 dataDone['cusps'].push(house);
//             }else if (planetName.match('mean') || planetName.match('true') || planetName=='Ascendant' || planetName.match('MC') || planetName =='Vertex' ){
//
//             }else {
//                 var planetAngle = dataPhP[planet].split(',')[1].trim();
//                 dataDone['planets'][planetName] = [planetAngle];
//             }
//
//         }
//         //dataDone['cusps'] = [300, 340, 30, 60, 75, 90, 116, 172, 210, 236, 250, 274];
//         res.render('index', {'data' : JSON.stringify(dataDone)});
//         console.log(JSON.stringify(dataDone));
// 		res.end();
// 	});
// });


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
