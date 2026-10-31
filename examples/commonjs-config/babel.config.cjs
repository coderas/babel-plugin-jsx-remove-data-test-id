const removeDataTestId = require('babel-plugin-jsx-remove-data-test-id');

module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [removeDataTestId]
};
