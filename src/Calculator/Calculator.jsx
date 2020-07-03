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
            moonPosition: {}
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
                                <button type="button" class="execute-button btn btn-primary btn-lg btn-block">Get My Moon</button>
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

    // Handles state changes for state objects
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(e.target.value);
    };
}