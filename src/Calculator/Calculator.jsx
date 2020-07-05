import React from 'react';
import './Calculator.css';
import Button from 'react-bootstrap/Button';
import MapAPI from '../MapAPI/MapAPI';
import Graphic from '../Graphic/Graphic';
import * as moonAlgorithms from './Algorithms.js';

export default class Calculator extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            date: new Date(),
            latitude: '',
            longitude: '',
            location: '',
            riseTime: '',
            setTime: '',
            phaseName: '',
            phasePercent: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    // When app loads for the first time
    componentDidMount() {
        
    }

    clear() {
        
    }   

    render() {
        return (
            <div className="app-container" class="app-container-fluid row justify-content-center">
                <div className="block-container" class="col-sm-12 col-md-10 col-lg-8 d-flex justify-content-center d-flex flex-column">
                    <div class="graphic-container">
                        <div className="app-container" class="app-container row justify-content-center d-flex flex-column">
                    <div className="date-location-container" class="row justify-content-between">
                        <div class="col-4" id="date-graphic"></div>
                        <div class="col-4" id="location-graphic"></div>
                    </div>
                    <div className="rise-set-time-container" class="row">
                        <div class="col-4" id="rise-time-graphic"></div>
                        <div className="graphic-container" class="col-4">
                            <img src="" alt="" id="moon-img-graphic"/>
                        </div>
                        <div class="col-4" id="set-time-graphic"></div>
                    </div>
                    <div className="phase-properties-container" class="row justify-content-center">
                        <div class="col-4">
                            <div id="phase-name-graphic"></div>
                            <div id="phase-percent-graphic"></div>
                        </div>
                    </div>
                </div>
                    </div>  
                    <div className="form-container" class="form container-fluid d-flex flex-column">
                        <div className="date-container" class="form-group row">
                            <label for="date-input" class="col-3 col-lg-2 col-form-label">Date</label>
                            <div class="col-4">
                                <input class="form-control" type="date" id="date-input" placeholder="" name="inputDate" value={this.state.inputDate} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="location-input-container" class="form-group row">
                            <label class="col-3 col-lg-2 col-form-label">Location</label>
                            <div class="col-4">
                                <input class="form-control" type="number" placeholder="Latitude" id="location-input-latitude" name="latitude" value={this.state.latitude} onChange={this.handleChange}/>
                            </div>
                            <div class="col-4">
                                <input class="form-control" type="number" placeholder="Longitude" id="location-input-longitude" name="longitude" value={this.state.longitude} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="location-button-container" class="form-group row">
                            <div class="col-3 col-lg-2"></div>
                            <div class="col-4 d-flex justify-content-start">
                                <Button class="location-button">My Location</Button>
                            </div>
                            <div class="col-4 d-flex justify-content-start " data-toggle="collapse" data-target="#map-api" aria-expanded="false" aria-controls="">
                                <Button class="location-button">Google Maps</Button>
                            </div>
                        </div>
                        <div className="google-maps-container" class="google-maps-container form-group row" id="google-maps-container">
                            <div class="col-3 col-lg-2"></div>
                            <div class=" col-7 map-api">
                                <MapAPI></MapAPI>
                            </div>
                            <div class="col-2 col-lg-auto"></div>
                        </div>
                        <div className="altitude-input-container" class="form-group row">
                            <label class="col-3 col-lg-2 col-form-label">Altitude</label>
                            <div class="input-group mb-3 col-6 col-lg-4">
                                <input type="number" min="0" class="form-control" placeholder="0" name="altitude" value={this.state.altitude} onChange={this.handleChange}/>
                                <div class="input-group-append">
                                    <span class="input-group-text" id="basic-addon2">meters</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="execute-clear-container" class="form-group row">
                            <div class="col-1 col-lg-2">
                            </div>
                            <div class="col-7 col-lg-6">
                                <button type="button" class="execute-button btn btn-primary btn-lg btn-block" onClick={this.calculateMoon}>Show me the moon-ey!</button>
                            </div>
                            <div class="col-3 col-lg-2">
                                <button type="button" class="execute-button btn btn-danger btn-lg btn-block">Clear</button>
                            </div>
                            <div class="col-auto">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Handles state changes for local objects
    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    };

    setDateState = () => {
        const inputDate = this.state.inputDate;
        let YY = parseInt(inputDate.substring(0,4)),
            MM = parseInt(inputDate.substring(5,7))-1,
            DD = parseInt(inputDate.substring(8,10)), 
            dateOBJ = new Date(),
            hh = dateOBJ.getHours(),
            mi = dateOBJ.getMinutes(),
            ss = dateOBJ.getSeconds(),
            mm = dateOBJ.getMilliseconds();

        const dateValue = new Date(YY, MM, DD, hh, mi, ss);
        this.setState({date: dateValue});
    }

    calculateMoon = () => {
        this.setDateState();
        var date = this.state.date,
            lat = this.state.latitude,
            lon = this.state.longitude,
            location = this.formatLatLon(lat, lon),
            riseTime = moonAlgorithms.getMoonRiseTime(date, lat, lon),
            setTime = moonAlgorithms.getMoonSetTime(date, lat, lon),
            phaseName = 'Sample Name',
            phasePercent = this.getPhasePercent();
        
        this.setState({
            location: this.formatLatLon(lat, lon),
            riseTime: moonAlgorithms.getMoonRiseTime(date, lat, lon),
            setTime: moonAlgorithms.getMoonSetTime(date, lat, lon),
            phaseName: 'Sample Name',
            phasePercent: this.getPhasePercent()
        })

        console.log(location, riseTime, setTime, phasePercent);

        this.setGraphic();
    };

    setGraphic = () => {
        document.getElementById("date-graphic").innerHTML = this.state.date;
        document.getElementById("location-graphic").innerHTML = this.state.location;
        document.getElementById("rise-time-graphic").innerHTML = this.state.riseTime;
        document.getElementById("set-time-graphic").innerHTML = this.state.setTime;
        document.getElementById("phase-name-graphic").innerHTML = this.state.phaseName;
        document.getElementById("phase-percent-graphic").innerHTML = this.state.phasePercent;
    }

    getPhaseName = () => {
        const date = this.state.date;
        const moonIllum = moonAlgorithms.getMoonIllumination(date);
        const phase = moonIllum.phase;
        // if (phase >= 0 && phase )
    };

    getPhasePercent = () => {
        const date = this.state.date;
        const moonIllum = moonAlgorithms.getMoonIllumination(date);
        const fraction = moonIllum.fraction;
        return (this.round(fraction, 4)*100 + '%');
    };

    // Copied from https://www.jacklmoore.com/notes/rounding-in-javascript/
    round = (value, decimals) => {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    };

    formatLatLon = (lat, lon) => {
        let latitude = lat,
            longitude = lon;

        // Latitude
        if (lat < 0) {
            latitude += '\xB0 S'
        } else if (lat > 0) {
            latitude += '\xB0 N'
        } else { // Assertion: 0 degrees
            latitude += '\xB0'
        }

        // Longitude
        if (lon < 0) {
            longitude += '\xB0 W'
        } else if (lon > 0) {
            longitude += '\xB0 E'
        } else { // Assertion: 0 degrees
            longitude += '\xB0'
        }

        return latitude + ' ' + longitude;
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
            // const angle = moonIllum.angle;