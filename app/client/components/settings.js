import React from 'react';

const Settings = props => (
  <div className='settings'>
    <form action='#'>
      <p>
        <label>
          <input name="group1" type="radio" />
          <span>Red</span>
        </label>
      </p>
      <div className="input-field col s12">
        <select defaultValue="2">
          <option value="">Choose your option</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </select>
        <label>Materialize Select</label>
      </div>
    </form>
  </div>
);

export default Settings;