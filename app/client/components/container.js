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
      </React.Fragment>
    </Router>;
  }
} 

export default Container;