import React from 'react';
import MapContainer from './map';
import Forecast from './forecast';
import Settings from './settings';

import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';

const Container = ({ title }) =>
  <Router>
    <div className='container'>
    <nav>
      <ul>
        <li>
          <NavLink to="/" exact={true} activeClassName="active"><i class="fa fa-star fa-3x"></i></NavLink>
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
      <Route path="/" exact component={MapContainer} />
      <Route path="/forecast" exact component={Forecast} />
      <Route path="/settings" exact component={Settings} />
    </main>
  </div>
  </Router>;

export default Container;