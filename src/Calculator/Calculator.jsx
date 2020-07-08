import React from 'react';
import $ from 'jquery';
import './Calculator.css';
import Button from 'react-bootstrap/Button';
import { GoogleApiWrapper, InfoWindow, Marker  } from 'google-maps-react';
import * as moonAlgorithms from './Algorithms.js';
import CurrentLocation from '../MapAPI/MapAPI';

import New from '../moonShapes/New.png';
import Young from '../moonShapes/Young.png';
import WaxingCrescent from '../moonShapes/WaxingCrescent.png';
import WaxingQuarter from '../moonShapes/WaxingQuarter.png';
import WaxingGibbous from '../moonShapes/WaxingGibbous.png';
import Full from '../moonShapes/Full.png';
import WaningGibbous from '../moonShapes/WaningGibbous.png';
import WaningQuarter from '../moonShapes/WaningQuarter.png';
import WaningCrescent from '../moonShapes/WaningCrescent.png';
import Old from '../moonShapes/Old.png';

export class Calculator extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            date: {},
            inputDate: {},
            latitude: {},
            longitude: {},
            location: {},
            riseTime: {},
            setTime: {},
            phaseName: {},
            phasePercent: {},
            moonImage: {},
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            leftGraphicSlot: {},
            rightGraphicSlot: {}
        };

        this.handleChange = this.handleChange.bind(this);
    }

    // When app loads for the first time
    componentDidMount() {
        // Sets lat/lon state (and as a result, input fields) to current position
        this.setLatLonState();

        // Sets current date in dateInput state (and as a result, date picker)
        this.setState({
            inputDate: this.getInputDate(new Date())
        });
    }  

    render() {
        return (
            <div className="app-container" class="app-container-fluid row justify-content-center" id="app-container">
                <div className="block-container" class="col-sm-12 col-md-11 col-lg-10 d-flex justify-content-center d-flex flex-column">
                    <div class="graphic-container">
                        <div className="app-container" class="justify-content-center d-flex flex-column">
                            <div className="date-location-container" class="row justify-content-between" id="date-location-container">
                                <div class="col-1 col-lg-2"></div>
                                <div class="graphic-element col-5 col-lg-4" id="date-graphic">&nbsp;</div>
                                <div class="graphic-element col-5 col-lg-4" id="location-graphic">&nbsp;</div>
                                <div class="col-1 col-lg-2"></div>
                            </div>
                            <div className="rise-set-time-container" class="row justify-content-center align-items-end" id="rise-set-time-container">
                                <div class="graphic-element col-4" id="rise-time-graphic">&nbsp;</div>
                                <div className="graphic-container graphic-element" class="col-4 col-lg-3">
                                    <img src="../../public/moonShapes/Full.png" alt="" id="moon-image"/>
                                </div>
                                <div class="graphic-element col-4" id="set-time-graphic">&nbsp;</div>
                            </div>
                            <div className="phase-properties-container" class="row justify-content-center">
                                <div class="graphic-element col-4">
                                    <div id="phase-name-graphic">&nbsp;</div>
                                    <div id="phase-percent-graphic">&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>  
                    <div className="form-container" class="form container-fluid d-flex flex-column">
                        <div className="date-container" class="form-group row">
                            <label htmlFor="date-input" class="col-1 col-lg-2 col-form-label"></label>
                            <div class="col-5 col-lg-4">
                                <input class="form-control" 
                                    type="date" id="date-input" 
                                    placeholder="" 
                                    name="inputDate" 
                                    value={this.state.inputDate} 
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="location-input-container" class="form-group row" id="location-fields">
                            <label class="col-1 col-lg-2 col-form-label"></label>
                            <div class="col-5 col-lg-4">
                                <input class="form-control" 
                                    type="number" 
                                    placeholder="Latitude" 
                                    id="location-input-latitude" 
                                    name="latitude" 
                                    value={this.state.latitude} 
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div class="col-5 col-lg-4">
                                <input 
                                    class="form-control" 
                                    type="number" 
                                    placeholder="Longitude" 
                                    id="location-input-longitude" 
                                    name="longitude" 
                                    value={this.state.longitude} 
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="location-button-container" class="form-group row">
                            <div class="col-1 col-lg-2"></div>
                            <div class="col-5 col-lg-4 d-flex justify-content-start">
                                <Button 
                                    class="location-button" 
                                    onClick={this.setLatLonState}
                                >My Location</Button>
                            </div>
                            <div class="col-5 col-lg-4 d-flex justify-content-start " data-toggle="collapse" data-target="#map-api" aria-expanded="false" aria-controls="">
                                <Button 
                                    class="maps-button" 
                                    data-toggle="collapse" 
                                    data-target="#google-maps-container" 
                                    aria-expanded="true" 
                                    aria-controls="#google-maps-container"
                                >Maps</Button>
                            </div>
                        </div>
                        <div className="google-maps-container" class="form-group row" id="google-maps-container">
                            <div class="col-1 col-lg-2"></div>
                            <div class=" col-7 map-api">
                                {/* <CurrentLocation centerAroundCurrentLocation google={this.props.google}>
                                    <Marker onClick={this.onMarkerClick} name={'current location'}/>
                                    <InfoWindow
                                        marker={this.state.activeMarker}
                                        visible={this.state.showingInfoWindow}
                                        onClose={this.onClose}
                                    >
                                        <div>
                                            <h4>{this.state.selectedPlace.name}</h4>
                                        </div>
                                    </InfoWindow>
                                </CurrentLocation> */}
                            </div>
                            <div class="col-1 col-lg-auto"></div>
                        </div>
                        <div className="execute-clear-container" class="form-group row">
                            <div class="col-1 col-lg-2">
                            </div>
                            <div class="col-7 col-lg-6">
                                <button 
                                    type="button" 
                                    class="execute-button btn btn-primary btn-lg btn-block" 
                                    onClick={this.calculateMoon}>
                                Generate</button>
                            </div>
                            <div class="col-3 col-lg-2">
                                <button 
                                    type="button" 
                                    class="execute-button btn btn-danger btn-lg btn-block"
                                    onClick={this.clear}>
                                Clear</button>
                            </div>
                            <div class="col-auto">
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
    

    /*
     * STATE HANDLING FUNCTIONS
    */ 
    
    handleChange (e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    };

    setLatLonState = () => {
        // Copied from: https://stackoverflow.com/questions/55829230/want-to-get-current-location-from-react-native-jsgoogle-api-key
        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                latitude: this.round(position.coords.latitude, 5),
                longitude: this.round(position.coords.longitude, 5),
                error: null,
              });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
        )
    };

    async setDateState () {
        const inputDate = this.state.inputDate;
        let YY = parseInt(inputDate.substring(0,4)),
            MM = parseInt(inputDate.substring(5,7))-1,
            DD = parseInt(inputDate.substring(8,10)), 
            dateOBJ = new Date(),
            hh = dateOBJ.getHours(),
            mi = dateOBJ.getMinutes(),
            ss = dateOBJ.getSeconds();

        const dateValue = new Date(YY, MM, DD, hh, mi, ss);
        await this.setState({date: dateValue});
        await this.setMoonDataState();
        this.setGraphic();
    }

    clear = () => {
        this.setState({
            date: {},
            inputDate: {},
            latitude: {},
            longitude: {},
            location: {},
            riseTime: {},
            setTime: {},
            phaseName: {},
            phasePercent: {},
            moonImage: {},
            leftGraphicSlot: {},
            rightGraphicSlot: {}
        });
    } 


    /*
     * MOON CALCULATION FUNCTIONS
    */    

    setMoonDataState () {
        var date = this.state.date,
            lat = this.state.latitude,
            lon = this.state.longitude,
            riseTimeVal = moonAlgorithms.getMoonRiseTime(date, lat, lon),
            setTimeVal = moonAlgorithms.getMoonSetTime(date, lat, lon),
            riseTimeOBJ = moonAlgorithms.getMoonTimes(date, lat, lon).rise,
            setTimeOBJ = moonAlgorithms.getMoonTimes(date, lat, lon).set,
            riseTimeText = '⭜ ' + riseTimeVal,
            setTimeText = '⭝ ' + setTimeVal;
        
        const times = this.compareRiseSetTimes(riseTimeOBJ, setTimeOBJ, riseTimeText, setTimeText);
        
        this.setState({
            location: this.formatLatLon(lat, lon),
            riseTime: riseTimeText.slice(0,1) + " ." + riseTimeText.slice(1),
            setTime: setTimeText.slice(0,1) + " ." + setTimeText.slice(1),
            phaseName: this.getPhaseName(),
            phasePercent: this.getPhasePercent(),
            moonImage: this.getPhaseName().replace(/\s+/g, ''),
            leftGraphicSlot: times.firstEvent,
            rightGraphicSlot: times.secondEvent
        }, this.setGraphic());
    }

    calculateMoon = () => {
        this.setDateState();
    };

    setGraphic = () => {
        document.getElementById("date-graphic").innerHTML = this.state.date.toString().slice(0,15);
        document.getElementById("location-graphic").innerHTML = this.state.location;
        document.getElementById("rise-time-graphic").innerHTML = this.state.leftGraphicSlot;
        document.getElementById("set-time-graphic").innerHTML = this.state.rightGraphicSlot;
        document.getElementById("phase-name-graphic").innerHTML = this.state.phaseName;
        document.getElementById("phase-percent-graphic").innerHTML = this.state.phasePercent;
        document.getElementById("moon-image").src = Full;
        document.getElementById("moon-image").alt = `${this.state.moonImage}`;
    }

    compareRiseSetTimes = (rise, set, riseText, setText) => {
        if (rise > set) {
            return {
                firstEvent: setText,
                secondEvent: riseText
            }
        } else {
            return {
                firstEvent: riseText,
                secondEvent: setText
            }
        }
    }

    getPhaseName = () => {
        const moonIllum = moonAlgorithms.getMoonIllumination(this.state.date);
        const phase = moonIllum.phase;
        if ((phase >= 0 && phase < 0.01) || phase >= 0.99) {
            return 'New';
        } else if (phase >= 0.01 && phase < 0.10) {
            return 'Young';
        } else if (phase >= 0.10 && phase < 0.24) {
            return 'Waxing Crescent';
        } else if (phase >= 0.24 && phase < 0.26) {
            return 'First Quarter';
        } else if (phase >= 0.26 && phase < 0.49) {
            return 'Waxing Gibbous';
        } else if (phase >= 0.49 && phase < 0.51) {
            return 'Full';
        } else if (phase >= 0.51 && phase < 0.74) {
            return 'Waning Gibbous';
        } else if (phase >= 0.74 && phase < 0.76) {
            return 'Waning Quarter';
        } else if (phase >= 0.76 && phase < 0.90) {
            return 'Waning Crescent';
        } else {
            //Assertion: phase >= 0.90 && phase < 0.99
            return 'Old';
        }
    };

    getPhasePercent = () => {
        const date = this.state.date;
        const moonIllum = moonAlgorithms.getMoonIllumination(date);
        const fraction = moonIllum.fraction;
        return (this.round(fraction, 4)*100 + '%');
    };


    /*
     * UTILITY FUNCTIONS
    */

    // Copied from https://www.jacklmoore.com/notes/rounding-in-javascript/
    round = (value, decimals) => {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    };

    formatLatLon = (lat, lon) => {
        let latitude = lat,
            longitude = lon;

        // Latitude
        if (lat < 0) {
            latitude = Math.abs(lat) + '\xB0 S';
        } else if (lat > 0) {
            latitude += '\xB0 N';
        } else { // Assertion: 0 degrees
            latitude += '\xB0';
        }

        // Longitude
        if (lon < 0) {
            longitude = Math.abs(lat) + '\xB0 W';
        } else if (lon > 0) {
            longitude += '\xB0 E';
        } else { // Assertion: 0 degrees
            longitude += '\xB0';
        }

        return latitude + ', ' + longitude;
    };

    getInputDate = (date) => {
        let yy = date.getFullYear(),
            mm = date.getMonth()+1,
            dd = date.getDate();
        
        if (mm < 10) {
            mm = '0' + mm;
        }

        if (dd < 10) {
            dd = '0' + dd;
        }

        return (yy + '-' + mm + '-' + dd);
    }


    /*
     * GOOGLE MAPS FUNCTIONS
    */

    onMarkerClick = (props, marker, e) =>
        this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
    });

    onClose = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDyFJ8p4lyEWfpaE9KEOE93iTAjO6X0sOE'
})(Calculator);

