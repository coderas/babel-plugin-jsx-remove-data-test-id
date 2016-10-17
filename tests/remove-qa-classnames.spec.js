import { transform } from 'babel-core';
import { expect } from 'chai';
import { minify } from 'uglify-js';

const uglify = code => minify(code, {
  fromString: true,
  mangle: false
}).code;

const config = {
  plugins: [
    './',
    ['transform-react-jsx', { pragma: 'j' }],
  ]
};

const configWithoutPlugin = {
  plugins: [
    ['transform-react-jsx', { pragma: 'j' }],
  ]
};

describe('jsx-remove-qa-classnames', () => {
  it('does not replace classNames that do not start with "qa-"', () => {
    const code = '<p className="cake-day">hi, finally it is cake time</p>';
    const actual = transform(code, config).code;
    const expected = transform(code, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('does not replace classNames that contain "qa-" but do not start with "qa-"', () => {
    const code = '<p className="not-qa-class">hi, finally it is cake time</p>';
    const actual = transform(code, config).code;
    const expected = transform(code, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('replaces classNames that start with "qa-"', () => {
    const code = '<p className="qa-class"></p>';
    const expectedCode = '<p></p>';
    const actual = transform(code, config).code;
    const expected = transform(expectedCode, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('preserves adjacent classNames classNames', () => {
    const code = '<p className="preserve-me qa-class and-me"></p>';
    const expectedCode = '<p className="preserve-me and-me"></p>';
    const actual = transform(code, config).code;
    const expected = transform(expectedCode, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

});
