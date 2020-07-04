import React from 'react';
import './Graphic.css';

import * as moonAlgorithms from '../Calculator/Algorithms.js';
import * as calculator from '../Calculator/Calculator.jsx';

export default class Graphic extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        };

        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        
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
}