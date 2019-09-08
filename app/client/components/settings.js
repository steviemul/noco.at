import React from 'react';
import PropTypes from 'prop-types';

const MARKERS_KEY = 'cnc_markers';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.updateSaveOption = this.updateSaveOption.bind(this);
    this.updateTemperaturePreferences = this.updateTemperaturePreferences.bind(this);
    this.updateForecastPreferences = this.updateForecastPreferences.bind(this);
  }

  componentDidMount() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

  updateSaveOption(event) {
    this.props.updatePreferences(
      event.target.checked,
      this.props.temperaturePreferences,
      this.props.forecastPreferences
    );
  }

  updateTemperaturePreferences(event) {
    this.props.updatePreferences(
      this.props.saveMarkers,
      event.target.value,
      this.props.forecastPreferences
    );
  }

  updateForecastPreferences(event) {
    this.props.updatePreferences(
      this.props.saveMarkers,
      this.props.temperaturePreferences,
      event.target.value
    );
  }

  clearMarkers() {
    localStorage.removeItem(MARKERS_KEY);
  }

  render() {
    return (
      <div className='container'>
        <div className='row settings valign-wrapper'>
          <form action='#' className="col s12">
            <div className="input-field col s12">
              <p>
                <label>
                  <input type="checkbox" onChange={this.updateSaveOption} checked={this.props.saveMarkers} />
                  <span>Save Markers</span>
                </label>
              </p>
            </div>
            <div className="input-field col s12">
              <div className="select-wrapper">
                <select value={this.props.temperaturePreferences} onChange={this.updateTemperaturePreferences}>
                  <option value="1">I get cold easily</option>
                  <option value="2">Neutral</option>
                  <option value="3">I don&apos;t mind the cold</option>
                  <option value="4">I&apos;m Chuck Norris</option>
                </select>
              </div>
              <label>Temperature Preferences</label>
            </div>
            <div className="input-field col s12">
              <div className="select-wrapper">
                <select value={this.props.forecastPreferences} onChange={this.updateForecastPreferences}>
                  <option value="1">Today</option>
                  <option value="2">Today and Tomorrow</option>
                  <option value="3">Next 3 days</option>
                  <option value="4">Next 4 days</option>
                  <option value="5">Next 5 days</option>
                </select>
              </div>
              <label>Forecast Preferences</label>
            </div>
            <div className="input-field col s12">
              <button className="btn waves-effect waves-light" onClick={this.clearMarkers}>Clear Markers
                <i className="material-icons right">delete</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  saveMarkers: PropTypes.bool.isRequired,
  temperaturePreferences: PropTypes.any.isRequired,
  forecastPreferences: PropTypes.any.isRequired,
  updatePreferences: PropTypes.func.isRequired
};

export default Settings;
