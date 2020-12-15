var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
var runner = require("child_process");

var ephModule = require('./modules/eph');



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
    var formData = {};
    var parametres = '';
    if (req.body){
        if (req.body.dateOfBirth){
            //var dateOfBirth = req.body.dateOfBirth;
            formData.dateOfBirth =  req.body.dateOfBirth;
            parametres+= ' '+ req.body.dateOfBirth
        }
        if (req.body.long){
            //var longitude = req.body.long;
            formData.longitude = req.body.long;
            parametres+= ' '+ req.body.long;
        }
        if (req.body.lat){
            //var latitude = req.body.lat;
            formData.latitude = req.body.lat;
            parametres+= ' '+ req.body.lat;
        }
        if (req.body.time){
            //var latitude = req.body.lat;
            formData.time = req.body.time;
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

        dataDone['planets']['Moon'] = [parseInt(eph.moon.longitude)];
        dataDone['planets']['Sun'] = [parseInt(eph.sun.longitude)];
        dataDone['planets']['Neptune'] = [parseInt(eph.neptune.longitude)];
        dataDone['planets']['Mercury'] = [parseInt(eph.mercury.longitude)];
        dataDone['planets']['Venus'] = [parseInt(eph.venus.longitude)];
        dataDone['planets']['Mars'] = [parseInt(eph.mars.longitude)];
        dataDone['planets']['Jupiter'] = [parseInt(eph.jupiter.longitude)];
        dataDone['planets']['Uranus'] = [parseInt(eph.uranus.longitude)];
        dataDone['planets']['Saturn'] = [parseInt(eph.saturn.longitude)];
        dataDone['planets']['Pluto'] = [parseInt(eph.pluto.longitude)];
        dataDone['planets']['Chiron'] = [parseInt(eph.chiron.longitude)];
        dataDone['planets']['NNode'] = [parseInt(eph.true_node.longitude)];
        dataDone['planets']['Lilith'] = [parseInt(eph.lilith.longitude)];

        console.log(JSON.stringify(dataDone));

        res.render('index', {'data' : dataDone, 'error' :false});

        // execPHP.parseFile(req.originalUrl+'.php', parametres, function(success, phpResult) {
        //     //console.log('success: ' +success +' data: ' +phpResult);
        //     if (success){
        //
        //
        //         // var dataPhP = JSON.parse(phpResult);
        //         // var dataDone = {};
        //         // dataDone['planets'] = {};
        //         // dataDone['cusps'] = [];
        //         // for (var planet in dataPhP){
        //         //     var planetName = dataPhP[planet].split(',')[0].trim();
        //         //     if (planetName.match('house')){
        //         //         var house = parseInt(dataPhP[planet].split(',')[1].trim());
        //         //         dataDone['cusps'].push(house);
        //         //     }else if (planetName.match('mean') || planetName.match('true') || planetName=='Ascendant' || planetName.match('MC') || planetName =='Vertex' ){
        //         //
        //         //     }else {
        //         //         var planetAngle = dataPhP[planet].split(',')[1].trim();
        //         //         dataDone['planets'][planetName] = [planetAngle];
        //         //     }
        //         //
        //         // }
        //         // //console.log(dataDone);
        //         // dataDone['cusps'] = [300, 340, 30, 60, 75, 90, 116, 172, 210, 236, 250, 274];
        //         // res.render('index', {'data' : dataDone, 'error' :false});
        // 		// res.end();
        //     }else{
        //         res.render('index', {'data' : {}, 'error' :true});
        //     }
        //
    	// });

    })


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
