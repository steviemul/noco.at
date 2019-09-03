import React from 'react';

class MapContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      status: null
    };

    this.initMap = this.initMap.bind(this);
    this.reset = this.reset.bind(this);
    this.lookup = this.lookup.bind(this);
  }

  initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      draggableCursor: 'crosshair'
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        const myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(myLatlng);
        this.props.updateCoords(position.coords.longitude, position.coords.latitude);
        this.lookup(position.coords.longitude, position.coords.latitude);
      });
    }

    map.addListener('click', (location) => {
      const lon = location.latLng.lng();
      const lat = location.latLng.lat();
      
      this.lookup(lon, lat);
    });
  }

  lookup(lon, lat) {

    fetch(`/api/lookup?lon=${lon}&lat=${lat}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({
          status: response.item.result.label
        });

        this.props.updateCoords(lon, lat);
      }
      )
  }

  reset() {
    this.setState({
      status: null
    });
  }

  componentDidMount() {
    this.initMap();
  }

  render() {
    return <div>
      <div className={'map ' + (this.state.status === null ? 'front' : '')} id='map'></div>
      <div className={'answer ' + (this.state.status !== null ? 'front' : '')} id='answer'>
        <p>{this.state.status}</p>
        <button onClick={this.reset}>Back</button>
      </div>
    </div> 
    
  }
}

export default MapContainer;