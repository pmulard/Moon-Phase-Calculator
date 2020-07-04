import React from 'react';
import './Graphic.css';

import * as moonAlgorithms from '../Calculator/Algorithms.js';
import Calculator from '../Calculator/Calculator';

export default class Graphic extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            moonImgs: {}
        };

        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setMoonImgs();
    }

    render() {
        return (
            <div className="app-container" class="app-container row justify-content-center d-flex flex-column">
                <div className="date-location-container" class="row justify-content-between">
                    <div class="col-4" id="date">Date</div>
                    <div class="col-4" id="location">Location</div>
                </div>
                <div className="rise-set-time-container" class="row">
                    <div class="col-4" id="rise-time">Rise Time</div>
                    <div className="graphic-container" class="col-4">
                        <img src="" alt="" id="moon-img"/>
                    </div>
                    <div class="col-4" id="set-time">Set Time</div>
                </div>
                <div className="phase-properties-container" class="row justify-content-center">
                    <div class="col-4">
                        <div id="phase-name">Phase Name</div>
                        <div id="phase-percent">%</div>
                    </div>
                </div>
            </div>
        )
    }

    setMoonImgs = () => {
        let moonImgs = {};
    }

    setData = () => {
        const moon = Calculator.calculateMoon();
        var date = moon.date,
            latitude = moon.latitude,
            longitude = moon.longitude,
            location = this.formatLatLon(latitude, longitude),
            riseTime = moon.riseTime,
            setTime = moon.setTime,
            phaseName = moon.phaseName,
            phasePercent = moon.phasePercent;

        this.setState(
            {date},
            {location},
            {riseTime},
            {setTime},
            {phaseName},
            {phasePercent}
        );

        document.getElementById("date").innerHTML = date;
        document.getElementById("location").innerHTML = location;
        document.getElementById("rise-time").innerHTML = riseTime;
        document.getElementById("set-time").innerHTML = setTime;
        document.getElementById("phase-name").innerHTML = phaseName;
        document.getElementById("phase-percent").innerHTML = phasePercent;
    
    }

    formatLatLon = (lat, lon) => {
        let latitude = lat,
            longitude = '';

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