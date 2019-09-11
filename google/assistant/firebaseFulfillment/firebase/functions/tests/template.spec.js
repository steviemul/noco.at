const template = require('../utils/template');

test('is true', () => {
  const result = template.random(['Hello {0}', 'Hi {0}'], 'steve');

  expect(result).toBeOneOf(['Hello steve', 'Hi steve']);
});
