import React from 'react';

class MapContainer extends React.Component {

  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
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
      });
    }

    map.addListener('click', (location) => {
      const lon = location.latLng.lng();
      const lat = location.latLng.lat();
      fetch(`/api/lookup?lon=${lon}&lat=${lat}`)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          alert(response.item.result.label);
          this.props.updateCoords(lon, lat);
        }
      )
    });
  }

  componentDidMount() {
    this.initMap();
  }

  render() {
    return <div class='map' id='map'></div>
  }
}

export default MapContainer;