import React from 'react';

const icon = (title, icon) => {
  const url = `http://openweathermap.org/img/wn/${icon}.png`;

  return <img src={url} alt={title} title={title}></img>
}

class MapContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      item: null
    };

    this.initMap = this.initMap.bind(this);
    this.reset = this.reset.bind(this);
    this.lookup = this.lookup.bind(this);
    this.sendCorrection = this.sendCorrection.bind(this);
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      draggableCursor: 'crosshair',
      gestureHandling: 'greedy'
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        const myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(myLatlng);
        this.props.updateCoords(position.coords.longitude, position.coords.latitude);
        this.lookup(position.coords.longitude, position.coords.latitude);
      });
    }

    this.map.addListener('click', (location) => {
      const lon = location.latLng.lng();
      const lat = location.latLng.lat();
      
      this.lookup(lon, lat);
    });
  }

  lookup(lon, lat) {

    fetch(`/api/lookup?lon=${lon}&lat=${lat}&a=0&t=0`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState(response);

        this.props.updateCoords(lon, lat);

        const marker = new google.maps.Marker({
          position: {lat: lat, lng:lon},
          map: this.map
        });

        marker.addListener('click', () => {
          this.lookup(lon, lat);
        });
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
    .then(response => {
      if (response.status === 202) {
        console.log('correction send');
      }
      else  {
        console.log('correction not sent');
      }

      this.reset();
    })
    .catch (e => {
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

export default MapContainer;