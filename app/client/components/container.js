import React from 'react';
import MapContainer from './map';
import Forecast from './forecast';
import Settings from './settings';

import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';

const PREFERENCES_KEY = 'cnc_preferences';

const getPreferences = () => {
  const preferences = localStorage.getItem(PREFERENCES_KEY);

  const defaults = {
    saveMarkers: false,
    temperaturePreferences: 2,
    forecastPreferences: 1
  };

  if (preferences) {
    return {
      ...defaults,
      ...JSON.parse(preferences)
    };
  }

  return defaults;
};

const savePreferences = (values) => {
  const preferences = {
    saveMarkers: values.saveMarkers || false,
    temperaturePreferences: values.temperaturePreferences || 2,
    forecastPreferences: values.forecastPreferences || 1
  };

  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
};

class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lon: 0,
      lat: 0,
      ...getPreferences()
    };

    this.updateCoords = this.updateCoords.bind(this);
    this.updatePreferences = this.updatePreferences.bind(this);
  }

  updatePreferences(saveMarkers, temperaturePreferences, forecastPreferences) {
    this.setState({
      ...this.state,
      saveMarkers,
      temperaturePreferences,
      forecastPreferences
    }, () => {
      savePreferences(this.state);
    });
  }

  updateCoords(lon, lat) {
    this.setState({
      ...this.state,
      lon,
      lat
    });
  }

  render() {
    return <Router>
      <React.Fragment>
        <header>
          <div className="navbar-fixed">
            <nav>
              <div className="nav-wrapper">
                <ul className="row">
                  <li className="col s4">
                    <NavLink to="/" exact={true} activeClassName="active"><i className="large material-icons">my_location</i></NavLink>
                  </li>
                  <li className="col s4">
                    <NavLink to="/forecast" activeClassName="active"><i className="large material-icons">fast_forward</i></NavLink>
                  </li>
                  <li className="col s4">
                    <NavLink to="/settings" activeClassName="active"><i className="large material-icons">settings</i></NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </header>
        <main>
          <Route
            path="/" exact
            render={(props) => <MapContainer {...props}
              lon={this.state.lon}
              lat={this.state.lat}
              saveMarkers={this.state.saveMarkers}
              temperaturePreferences={this.state.temperaturePreferences}
              updateCoords={this.updateCoords} />}
          />

          <Route
            path="/forecast" exact
            render={(props) => <Forecast {...props}
              lon={this.state.lon}
              lat={this.state.lat}
              forecastPreferences={this.state.forecastPreferences}
              temperaturePreferences={this.state.temperaturePreferences}
              updateCoords={this.updateCoords} />}
          />

          <Route
            path="/settings" exact
            render={(props) => <Settings {...props}
              lon={this.state.lon}
              lat={this.state.lat}
              saveMarkers={this.state.saveMarkers}
              forecastPreferences={this.state.forecastPreferences}
              temperaturePreferences={this.state.temperaturePreferences}
              updateCoords={this.updateCoords}
              updatePreferences={this.updatePreferences}/>}
          />

        </main>
      </React.Fragment>
    </Router>;
  }
}

export default Container;
