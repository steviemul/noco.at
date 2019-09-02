import React from 'react';

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const padDigit = (input) => {
  let output = input.toString();

  return (output.length == 1) ? `0${output}` : output;
}

const icon = (title, icon) => {
  const url = `http://openweathermap.org/img/wn/${icon}.png`;

  return <img src={url} alt={title} title={title}></img>
}

const formatDate = (dt) => {
  const date = new Date(dt * 1000);

  return DAYS[date.getDay()] + ' ' + (padDigit(date.getHours() + 1)) + ':' + padDigit(date.getMinutes());
};

class Forecast extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      query: {
        name: ''
      },
      items: []
    }

    this.loadForecast = this.loadForecast.bind(this);
  }

  loadForecast() {

    fetch(`/api/lookup?lon=${this.props.lon}&lat=${this.props.lat}&type=forcast`)
      .then((response) => response.json())
      .then((response) => {
        this.setState(response);
      })
  }

  componentDidMount() {
    this.loadForecast();
  }

  render () {
    return <React.Fragment>
      <div className='forecast-header'>
        <div><span></span></div>
        <div><i class="wi wi-thermometer"></i></div>
        <div><i class="wi wi-strong-wind"></i></div>
        <div><i class="wi wi-cloudy"></i></div>
        <div><i class="wi wi-humidity"></i></div>
      </div>
      <div className='forecast-items'>
        {this.state.items.map(item => 
          <React.Fragment>
            <div className='date'>{formatDate(item.data.dt)}</div>
            <div className='item'>
              <div><span>{item.result.label}</span></div>
              <div><span>{item.data.temperature}&#8451;</span></div>
              <div><span>{item.data.windspeed}mph</span></div>
              <div><span>{icon(item.data.weather[0].description, item.data.weather[0].icon)}</span></div>
              <div><span>{item.data.humidity}%</span></div>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  }
}

export default Forecast;