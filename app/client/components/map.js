import React from 'react';
import PropTypes from 'prop-types';

const icon = (title, icon) => {
  const url = `https://openweathermap.org/img/wn/${icon}.png`;

  return <img src={url} alt={title} title={title}></img>;
};

const MARKERS_KEY = 'cnc_markers';

const getMarkers = () => {
  const markers = new Set();

  const storedValues = localStorage.getItem(MARKERS_KEY);

  if (storedValues) {
    const markersCollection = JSON.parse(storedValues);

    if (markersCollection.forEach) {
      markersCollection.forEach((marker) => {
        markers.add(marker);
      });
    }
  }

  return markers;
};

const saveMarkers = (markers) => {
  const output = [];

  for (let value of markers) {
    output.push(value);
  }

  localStorage.setItem(MARKERS_KEY, JSON.stringify(output));
};

class MapContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: null
    };

    this.markers = getMarkers();

    this.initMap = this.initMap.bind(this);
    this.reset = this.reset.bind(this);
    this.lookup = this.lookup.bind(this);
    this.sendCorrection = this.sendCorrection.bind(this);
    this.saveMarker = this.saveMarker.bind(this);
    this.setLocation = this.setLocation.bind(this);
  }

  setLocation(lon, lat) {
     const myLatlng = new google.maps.LatLng(lat, lon);
     this.map.setCenter(myLatlng);
     this.props.updateCoords(lon, lat);
     this.lookup(lon, lat);
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      draggableCursor: 'crosshair',
      gestureHandling: 'greedy'
    });

    const searchParmas = new URL(document.location).searchParams;

    if (searchParmas.get('city')) {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({address: searchParmas.get('city')}, (results, status) => {
        if (status === 'OK') {
          this.setLocation(
            results[0].geometry.location.lng(),
            results[0].geometry.location.lat()
          );
        }
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        this.setLocation(position.coords.longitude, position.coords.latitude);
      });
    }

    this.map.addListener('click', (location) => {
      const lon = location.latLng.lng();
      const lat = location.latLng.lat();

      this.lookup(lon, lat);
    });

    for (let value of this.markers) {
      const coords = value.split('|');
      const lon = parseFloat(coords[0]);
      const lat = parseFloat(coords[1]);

      const marker = new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: this.map
      });

      marker.addListener('click', () => {
        this.lookup(lon, lat);
      });
    }
  }

  saveMarker(lon, lat) {
    if (this.props.saveMarkers) {
      const value = lon + '|' + lat;

      this.markers.add(value);
      saveMarkers(this.markers);
    }
  }

  lookup(lon, lat) {
    const n = this.props.temperaturePreferences || 2;

    fetch(`/api/lookup?lon=${lon}&lat=${lat}&n=${n}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState(response);

        this.props.updateCoords(lon, lat);

        if (!this.markers.has(lon + '|' + lat)) {
          const marker = new google.maps.Marker({
            position: {lat: lat, lng: lon},
            map: this.map
          });

          marker.addListener('click', () => {
            this.lookup(lon, lat);
          });

          this.saveMarker(lon, lat);
        }
      }
    );
  }

  reset() {
    this.setState({
      item: null
    });
  }

  sendCorrection() {
    fetch(`/api/correction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      if (response.status === 202) {
        console.log('correction send');
      } else {
        console.log('correction not sent');
      }

      this.reset();
    })
    .catch((e) => {
      console.error('error sending correction', e);
    });
  }

  componentDidMount() {
    this.initMap();
  }

  render() {
    return (
      <div>
        <div className={'map ' + (this.state.item === null ? 'front' : '')} id='map'></div>
        <div className={'answer ' + (this.state.item !== null ? 'front' : '')} id='answer'>
          {this.state.item && (
            <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">{this.state.item.result.label + ' (' + this.state.query.city + ')'}</span>
              <table>
                <tbody>
                  <tr className='answer-details'>
                    <td>{this.state.item.data.temperature}&#8451;</td>
                    <td>{this.state.item.data.windspeed}mph</td>
                    <td>{icon(this.state.item.data.weather[0].description, this.state.item.data.weather[0].icon)}</td>
                    <td>{this.state.item.data.humidity}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="card-action z-depth-5">
              <a href="#" onClick={this.reset}>Close</a>
              <a href="#" onClick={this.sendCorrection}>Correct this prediction</a>
            </div>
          </div>
          ) || null}
        </div>
      </div>
    );
  }
}

MapContainer.propTypes = {
  saveMarkers: PropTypes.bool.isRequired,
  updateCoords: PropTypes.func.isRequired,
  temperaturePreferences: PropTypes.any.isRequired
};

export default MapContainer;
