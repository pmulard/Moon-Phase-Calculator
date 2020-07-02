import React from 'react';
// import Button from 'react-bootstrap/Button';

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            array: []
        };
    }

    // When app loads for the first time
    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const array = [];
        this.setState({array});
    }   

    render() {
        const {array} = this.state;
        return (
            <div className="app-container" class="app-container d-flex-row">
            </div>
        );
    }
}