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

const getDay = (dt) => {
  const date = new Date(dt * 1000);
  return DAYS[date.getDay()];
}

const getTime = (dt) => {
  const date = new Date(dt * 1000);
  return (padDigit(date.getHours() + 1)) + ':' + padDigit(date.getMinutes());
}

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
    this.transformItems = this.transformItems.bind(this);
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

  transformItems() {
    const groups = [];

    this.state.items.forEach(item => {
      
      const day = getDay(item.data.dt);
      const time = getTime(item.data.dt);


      if (groups.length === 0 || groups[groups.length-1].day !== day) {
        const label = (groups.length === 0) ? 'today' : day;

        groups.push({
          day,
          label,
          items:[]
        });
      }

      item.data.time = time;
      groups[groups.length-1].items.push(item); 
    });

    return groups;
  }

  render () {
    return <React.Fragment>
      <table>

        <tbody>
         {this.transformItems().map((item) => 
            <React.Fragment key={item.day}>
              <tr className='day-header blue-grey darken-1'>
                <td colSpan='6'>{item.label}</td>
              </tr>
              {item.items.map((item, index) =>
                <tr key={item.data.dt} className={(index % 2 === 0 ? 'alt-row' : '')}>
                  <td>{getTime(item.data.dt)}</td>
                  <td>{item.data.temperature}&#8451;</td>
                  <td>{item.data.windspeed}mph</td>
                  <td>{icon(item.data.weather[0].description, item.data.weather[0].icon)}</td>
                  <td>{item.data.humidity}%</td>
                  <td className='coat-no-coat'>{item.result.label}</td>
                </tr>
              )}
            </React.Fragment>
          )}
        </tbody>
      </table>
  
    </React.Fragment>
  }
}

export default Forecast;