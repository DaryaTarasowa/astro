<?php


// path to swiss ephemeris library files
$libPath = "./php/sweph/";

putenv("PATH=$libPath");


        $h_sys = 'K';
        $birthday = $argv[1];
        $longitude = $argv[2];
        $latitude = $argv[3];
        $time = '00:00';
        // More about command line options: https://www.astro.com/cgi/swetest.cgi?arg=-h&p=0
        //exec ("./php/sweph/swetest -edir$libPath -b$birthday", $output);
        exec ("./php/sweph/swetest -edir$libPath -b$birthday -ut$time -p0123456789DAmt -sid1 -eswe -house$longitude,$latitude,$h_sys -fPls -g, -head", $output);
//        echo $output;
        # OUTPUT ARRAY
        # Planet Name, Planet Degree, Planet Speed per day
        print(json_encode($output));

        //phpinfo();

        //print "<h1>Hello world</h1>\n";



// /**
//  * Assuming birth date to be
//  * 9th August 2017, 9:35 PM
//  */
// $birthDate = new DateTime( '24 December 1987 15:20:00');
// //echo $birthDate->format('Y-m-d H:i:s'); echo '<br>';
//
// /**
//  * Latitude Longitude
//  * of Novosibirsk, Russia
//  */
// $latitude = 54.7172453;
// $longitude = 81.3239605;
//
// /**
//  * Timezone value for Nepal
//  * As Nepal time is 5 hours 45 minutes ahead of UTC
//  *
//  * Put this value according to your country
//  */
// $timezone = 6;
//
// /**
//  * Converting birth date/time to UTC
//  */
// $offset = $timezone * (60 * 60);
// $birthTimestamp = strtotime($birthDate->format('Y-m-d H:i:s'));
// $utcTimestamp = $birthTimestamp - $offset;
// //echo date('Y-m-d H:i:s', $utcTimestamp); echo '<br>';
//
// $date = date('d.m.Y', $utcTimestamp);
// $time = date('H:i:s', $utcTimestamp);



?>
