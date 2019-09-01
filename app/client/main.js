import React from 'react';
import ReactDOM from 'react-dom';

import Container from './components/container';

const title = 'My Minimal React Webpack Babel Setup';

ReactDOM.render(
  <Container title={title} />,
  document.getElementById('app')
);