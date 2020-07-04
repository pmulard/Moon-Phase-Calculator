import React from 'react';
import './Calculator.css';
import Button from 'react-bootstrap/Button';
import MapAPI from '../MapAPI/MapAPI';
import * as moonAlgorithms from './Algorithms.js';

export default class Calculator extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            moonIllumination: {},
            moonCoords: {},
            moonPosition: {},
            date: new Date(),
        };

        this.setDate = this.handleChange.bind(this);
    }

    // When app loads for the first time
    componentDidMount() {
        
    }

    clear() {
        const date = 0;
        const latitude = 0;
        const longitude = 0;
        const altitude = 0;
        const moonIllumination = {};
        const moonCoords = {};
        const moonPosition = {};
        this.setState(
            {date},
            {latitude},
            {longitude},
            {altitude},
            {moonIllumination},
            {moonCoords},
            {moonPosition}
        );
    }   

    render() {
        return (
            <div className="app-container" class="app-container row justify-content-center">
                <div className="block-container" class="col-sm-12 col-md-10 col-lg-8 d-flex justify-content-center">
                    <div className="form-container" class="form container-fluid">
                        <div className="date-container" class="form-group row">
                            <label for="date-input" class="col-3 col-lg-2 col-form-label">Date</label>
                            <div class="col-4">
                                <input class="form-control" type="date" value="2011-08-19" id="date-input" value={this.state.date} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="location-input-container" class="form-group row">
                            <label class="col-3 col-lg-2 col-form-label">Location</label>
                            <div class="col-4">
                                <input class="form-control" type="number" placeholder="Latitude" id="location-input-latitude" value={this.state.latitude} onChange={this.handleChange}/>
                            </div>
                            <div class="col-4">
                                <input class="form-control" type="number" placeholder="Longitude" id="location-input-longitude" value={this.state.longitude} onChange={this.handleChange}/>
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
                                <input type="number" min="0" class="form-control" placeholder="0" aria-label="Recipient's username" aria-describedby="basic-addon2" value={this.state.altitude} onChange={this.handleChange}/>
                                <div class="input-group-append">
                                    <span class="input-group-text" id="basic-addon2">meters</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="execute-clear-container" class="form-group row">
                            <div class="col-1 col-lg-2">
                            </div>
                            <div class="col-7 col-lg-6">
                                <button type="button" class="execute-button btn btn-primary btn-lg btn-block" onClick={this.calculateMoon}>Get My Moon</button>
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
        this.setState({ [e.target.name]: e.target.value });
        console.log(e.target.value);
    };




    calculateMoon = () => {
        const date = this.state.date;
        const lat = this.state.latitude;
        const lon = this.state.longitude;
        const altitude = this.state.altitude;

        // Retrieving the moon objects that hold data
        const moonCoord = moonAlgorithms.moonCoords(date);
        const moonPos = moonAlgorithms.getMoonPosition(date, lat, lon, altitude);
        const moonIllum = moonAlgorithms.getMoonIllumination(date);

        /*
         * Moon Fraction - illuminated fraction of the moon;
         * varies from 0.0 (new moon) to 1.0 (full moon)
        */
        const fraction = moonIllum.fraction;

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
        const phase = moonIllum.phase;

        /*
         * Moon Angle - midpoint angle in radians of the 
         * illuminated limb of the moon reckoned eastward 
         * from the north point of the disk; the moon is 
         * waxing if the angle is negative, and waning if 
         * positive
        */
        const angle = moonIllum.angle;


        console.log(moonIllum);
        console.log(moonCoord);
        console.log(moonPos);
        console.log(this.getPhasePercent());
        console.log(moonAlgorithms.getMoonRiseTime(date, lat, lon));
        console.log(moonAlgorithms.getMoonSetTime(date, lat, lon));
    }

    getPhaseName = () => {
        const date = this.state.date;
        const moonIllum = moonAlgorithms.getMoonIllumination(date);
        const phase = moonIllum.phase;
        // if (phase >= 0 && phase )
    }

    getPhasePercent = () => {
        const date = this.state.date;
        const moonIllum = moonAlgorithms.getMoonIllumination(date);
        const fraction = moonIllum.fraction;
        return (this.round(fraction, 4)*100);
    }

    // Copied from https://www.jacklmoore.com/notes/rounding-in-javascript/
    round = (value, decimals) => {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }    

    
}