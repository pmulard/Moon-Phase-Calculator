/* 
  Derived from http://aa.quae.nl/en/reken/hemelpositie.html
  Code borrowed from https://github.com/mourner/suncalc
  I added some annotations to better explain the math and theory.
*/

// Shorthanding common constants and functions
var PI = Math.PI,
    rad = PI/180,
    sin = Math.sin,
    cos = Math.cos,
    tan = Math.tan,
    asin = Math.asin,
    acos = Math.acos,
    atan = Math.atan,
    dayMs = 1000 * 60 * 60 * 24;

/* 
  Julian dates are the standard for mathematical operations in astrology.
  It's value is the amount of days passed since the initial epoch in 4713 BC.
  As a result, the remainder when divided by 7 equals the day of the week.
  More info here: https://en.wikipedia.org/wiki/Julian_day
                  https://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
  Below are date and time conversions to and from Julian.
*/
var dayMS = 24*60*60*1000,
    J1970 = 2440588, // Needed for using the built in javascript date function.
    J2000 = 2451545; // https://www.geeksforgeeks.org/javascript-date-valueof-function/ 

// Date obj -> Julian (The decimal value is the time of day, with millisecond precision).
// We will be referencing this as (j) when inputting as a parameter.
const toJulian = (date) => { return date.valueOf() / dayMS - 0.5 + J1970; }
// Julian -> Date obj
const fromJulian = (j) => { return new Date((j + 0.5 - J1970) * dayMS); }
// We will be referencing this as (d) when inputting as a parameter.
const toDays = (date) => { return toJulian(date) - J2000; }



/*
  EARTH - General properties and calculations related to position.  
*/              
var e = rad * 23.4397; // obliquity of the Earth (axial tilt)
                       // More info here: https://en.wikipedia.org/wiki/Axial_tilt

function rightAscension(lon, lat) { return atan(sin(lon) * cos(e) - tan(lat) * sin(e), cos(lon)); }
function declination(lon, lat)    { return asin(sin(lat) * cos(e) + cos(lat) * sin(e) * sin(lon)); }
function azimuth(H, phi, dec)  { return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)); }
function altitude(H, phi, dec) { return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H)); }
function siderealTime(d, lw) { return rad * (280.16 + 360.9856235 * d) - lw; }



/*
  ecliptic coordinate system : https://en.wikipedia.org/wiki/Ecliptic_coordinate_system
  By combining two angles (ascension and declination) with the distance from a single 
  point on earth, we can find the 3D coordinates of the moon. 
  
  More info here: https://skyandtelescope.org/astronomy-resources/right-ascension-declination-celestial-coordinates/
*/
export const moonCoords = (d) => {  // geocentric ecliptic coordinates of the moon
                                    // d = toDays(date)

    var L = rad * (218.316 + 13.176396 * d), // ecliptic longitude
        M = rad * (134.963 + 13.064993 * d), // mean anomaly
        F = rad * (93.272 + 13.229350 * d),  // mean distance

        lon  = L + rad * 6.289 * sin(M), // longitude
        lat  = rad * 5.128 * sin(F),     // latitude
        dt = 385001 - 20905 * cos(M);  // distance to the moon (km)

    return {
        ra: rightAscension(lon, lat),
        dec: declination(lon, lat),
        dist: dt
    };
}

// eslint-disable-next-line
export const getMoonPosition = (date, lat, lon) => {

    var lw  = rad * -lon,
        phi = rad * lat,
        d   = toDays(date),

        coord = moonCoords(d),
        H = siderealTime(d, lw) - coord.ra,
        h = altitude(H, phi, coord.dec);

        // altitude correction for refraction
        h = h + rad * 0.017 / tan(h + rad * 10.26 / (h + rad * 5.10));

    return {
        azimuth: azimuth(H, phi, coord.dec),
        altitude: h,
        distance: coord.dist
    };
}

// More info here: https://www.science-on-stage.eu/images/download/iStage_10_Phases_of_the_Moon.pdf
// eslint-disable-next-line
export const getMoonIllumination = (date) => {

    var d = toDays(date),
        s = sunCoords(d), // See SUN section below
        m = moonCoords(d),

        sdist = 149598000, // distance from Earth to Sun in km

        phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra)),
        inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi)),
        angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) -
                cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));

    return {
        fraction: (1 + cos(inc)) / 2,
        phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / PI,
        angle: angle
    };
}



/*
  SUN - General properties and calculations.
*/
const solarMeanAnomaly = (d) => { 
    return rad * (357.5291 + 0.98560028 * d); 
}

const eclipticLongitude = (M) => {

    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
        P = rad * 102.9372; // perihelion of the Earth

    return M + C + P + PI;
} 

const sunCoords = (d) => {

    var M = solarMeanAnomaly(d),
        L = eclipticLongitude(M);

    return {
        dec: declination(L, 0),
        ra: rightAscension(L, 0)
    };
}



/*
  MOON Rise and Set Times
*/

export const getMoonRiseTime = (date, lat, lon) => {
    const moon = getMoonTimes(date, lat, lon);

    if (moon.alwaysUp || moon.alwaysDown) {
        return 'No rise'
    }
    
    return getTimeOfDay(moon.rise);
}

export const getMoonSetTime = (date, lat, lon) => {
    const moon = getMoonTimes(date, lat, lon);

    if (moon.alwaysUp || moon.alwaysDown) {
        return 'No set'
    }
    
    return getTimeOfDay(moon.set);
}

export const getMoonTimes = (date, lat, lng, inUTC) => {
    var t = new Date(date);
    if (inUTC) t.setUTCHours(0, 0, 0, 0);
    else t.setHours(0, 0, 0, 0);

    var hc = 0.133 * rad,
        h0 = getMoonPosition(t, lat, lng).altitude - hc,
        h1, h2, rise, set, a, b, xe, ye, d, roots, x1, x2, dx;

    // go in 2-hour chunks, each time seeing if a 3-point quadratic curve crosses zero (which means rise or set)
    for (var i = 1; i <= 24; i += 2) {
        h1 = getMoonPosition(hoursLater(t, i), lat, lng).altitude - hc;
        h2 = getMoonPosition(hoursLater(t, i + 1), lat, lng).altitude - hc;

        a = (h0 + h2) / 2 - h1;
        b = (h2 - h0) / 2;
        xe = -b / (2 * a);
        ye = (a * xe + b) * xe + h1;
        d = b * b - 4 * a * h1;
        roots = 0;

        if (d >= 0) {
            dx = Math.sqrt(d) / (Math.abs(a) * 2);
            x1 = xe - dx;
            x2 = xe + dx;
            if (Math.abs(x1) <= 1) roots++;
            if (Math.abs(x2) <= 1) roots++;
            if (x1 < -1) x1 = x2;
        }

        if (roots === 1) {
            if (h0 < 0) rise = i + x1;
            else set = i + x1;

        } else if (roots === 2) {
            rise = i + (ye < 0 ? x2 : x1);
            set = i + (ye < 0 ? x1 : x2);
        }

        if (rise && set) break;

        h0 = h2;
    }

    var result = {};

    if (rise) result.rise = hoursLater(t, rise);
    if (set) result.set = hoursLater(t, set);

    if (!rise && !set) result[ye > 0 ? 'alwaysUp' : 'alwaysDown'] = true;

    return result;
};

const hoursLater = (date, h) => {
    return new Date(date.valueOf() + h * dayMs / 24);
}

const getTimeOfDay = (date) => {
    let hh = date.getHours(),
        mm = date.getMinutes();

    if (mm < 10) {
        mm = '0' + mm;
    }

    if (hh > 12) {
        return ((hh-12) + ':' + mm + ' PM');
    } else {
        // Sets midnight hour
        if (hh === 0) {
            hh = 12;
        }

        // Assertion: Time is before 13:00 (1PM)
        return (hh + ':' + mm + ' AM');
    }
}




// Retrieving the moon objects that hold data
            // const moonIllum = moonAlgorithms.getMoonIllumination(date);

            /*
            * Moon Fraction - illuminated fraction of the moon;
            * varies from 0.0 (new moon) to 1.0 (full moon)
            */
            // const fraction = moonIllum.fraction;

            /*
            *  Moon Phase - moon phase; varies from 0.0 to 1.0:
            *      0	New Moon
            *          Waxing Crescent
            *   0.25	First Quarter
            *          Waxing Gibbous
            *    0.5	Full Moon
            *          Waning Gibbous
            *   0.75	Last Quarter
            *          Waning Crescent
            */
            // const phase = moonIllum.phase;

            /*
            * Moon Angle - midpoint angle in radians of the 
            * illuminated limb of the moon reckoned eastward 
            * from the north point of the disk; the moon is 
            * waxing if the angle is negative, and waning if 
            * positive
            */
            // const angle = moonIllum.angle