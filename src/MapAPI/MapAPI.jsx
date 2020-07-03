import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

export class MapAPI extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // array: []
        };
    }

    render() {
        return (
            <Map
            google={this.props.google}
            zoom={12}
            style={mapStyles}
            initialCenter={{ lat: 37.773972, lng: -122.431297}}
            />
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo'
})(MapAPI);

const mapStyles = {
    width: '100%',
    height: '100%',
};
