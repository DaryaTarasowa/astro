
var swisseph = require ('swisseph');

// Test date


var flag = swisseph.SEFLG_TOPOCTR;


// path to ephemeris data
swisseph.swe_set_ephe_path (__dirname + '/../ephe');




module.exports = {

    getEph: function(formData, callback) {
        var data = {};
        var timeZone = parseInt(formData.timeZone);
        if (formData.dateOfBirth){
            var dateArray = formData.dateOfBirth.split('.');
            var hours = false;
            if (formData.timeOfBirth){
                hours = parseInt(formData.timeOfBirth.substr(0,2) - formData.timeZone);
            }
            if (dateArray.length !== 3){
                callback(false);
            }else{
                var date = '';
                if (hours){
                    date = {year: parseInt(dateArray[2]), month: parseInt(dateArray[1]), day: parseInt(dateArray[0]), hour: hours};
                }else{
                    date = {year: parseInt(dateArray[2]), month: parseInt(dateArray[1]), day: parseInt(dateArray[0]), hour: 12};
                }

                if (formData.longitude && formData.latitude){
                    // Julian day
                    var long = parseFloat(formData.longitude);
                    var lat = parseFloat(formData.latitude);

                    swisseph.swe_julday (date.year, date.month, date.day, date.hour, swisseph.SE_GREG_CAL, function (julday_ut) {

                        //coordinates
                        swisseph.swe_set_topo (lat, long, 0);

                        //houses only if hour is set
                        if (hours){
                            swisseph.swe_houses (julday_ut, lat, long, 'T', function (result) {
                                      data.houses = result;
                            });
                        }

                    	// Sun position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_SUN, flag, function (body) {
                            data.sun = body;
                    	});

                    	// Moon position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_MOON, flag, function (body) {
                            data.moon = body;
                    	});

                        // Mercury position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_MERCURY, flag, function (body) {
                            data.mercury = body;
                    	});

                        // Venus position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_VENUS, flag, function (body) {
                            data.venus = body;
                    	});

                        // Mars position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_MARS, flag, function (body) {
                            data.mars = body;
                    	});

                        // Jupiter position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_JUPITER, flag, function (body) {
                            data.jupiter = body;
                    	});

                        // Saturn position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_SATURN, flag, function (body) {
                            data.saturn = body;
                    	});

                        // Uranus position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_URANUS, flag, function (body) {
                            data.uranus = body;
                    	});
                        //Neptune
                        swisseph.swe_calc_ut (julday_ut, swisseph.SE_NEPTUNE, flag, function (body) {
                            data.neptune = body;
                    	});

                        // Pluto position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_PLUTO, flag, function (body) {
                            data.pluto = body;
                    	});

                        // Chiron position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_CHIRON, flag, function (body) {
                            data.chiron = body;
                    	});

                        // True Node position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_TRUE_NODE, flag, function (body) {
                            data.true_node = body;
                    	});

                        // Lilith position
                    	swisseph.swe_calc_ut (julday_ut, swisseph.SE_MEAN_APOG, flag, function (body) {
                            data.lilith = body;
                    	});

                        callback(true, data);
                    });
                }else{
                    callback(false);
                }


            }
        }else{
            callback(false);
        }
    },


};
