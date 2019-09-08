import React from 'react';
import PropTypes from 'prop-types';

const MARKERS_KEY = 'cnc_markers';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.updateSaveOption = this.updateSaveOption.bind(this);
    this.updateTemperaturePreferences = this.updateTemperaturePreferences.bind(this);
  }

  componentDidMount() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

  updateSaveOption(event) {
    const value = event.target.checked;

    this.props.updatePreferences(value, this.props.temperaturePreferences);
  }

  updateTemperaturePreferences(event) {
    this.props.updatePreferences(this.props.saveMarkers, event.target.value);
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
  updatePreferences: PropTypes.func.isRequired
};

export default Settings;
