import React from 'react';
import MapContainer from './map';
import Forecast from './forecast';
import Settings from './settings';

import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';

class Container extends React.Component {

  constructor(props) {
    super(props);

    this.state = {lon:0, lat:0};
    this.updateCoords = this.updateCoords.bind(this);
  }

  updateCoords(lon, lat) {
    this.setState({
      lon,
      lat
    });
  }

  render() {
    return <Router>
      <div className='container'>
        <nav>
          <ul>
            <li>
              <NavLink to="/" exact={true} activeClassName="active"><i class="fa fa-map-marker fa-3x"></i></NavLink>
            </li>
            <li>
              <NavLink to="/forecast" activeClassName="active"><i class="fa fa-chevron-right fa-3x"></i></NavLink>
            </li>
            <li>
              <NavLink to="/settings" activeClassName="active"><i class="fa fa-cog fa-3x"></i></NavLink>
            </li>
          </ul>
        </nav>
        <main>
          <Route 
            path="/" exact 
            render={(props) => <MapContainer {...props} lon={this.state.lon} lat={this.state.lat} updateCoords={this.updateCoords} />}
          />

          <Route 
            path="/forecast" exact 
            render={(props) => <Forecast {...props} lon={this.state.lon} lat={this.state.lat} updateCoords={this.updateCoords} />} 
          />

          <Route 
            path="/settings" exact 
            render={(props) => <Settings {...props} lon={this.state.lon} lat={this.state.lat} updateCoords={this.updateCoords} />} 
          />

        </main>
      </div>
    </Router>;
  }
} 

export default Container;