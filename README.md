## babel-plugin-jsx-remove-data-test-id

Remove `data-test-id` attributes from your production builds.

### Motivation

It's not usually a good idea to couple our test code with DOM element id's or CSS classnames.

- Finding by an `.o-some-class` or `#some-id` selector couples our test to the CSS; making changes can be expensive from a maintainance point of view, whether they are coming from the CSS or the tests
- Finding elements by DOM tag, such as `<span />` or `<p>` can be equally as difficult to maintain; these things move around so if your looking for `.first()` you might get a nasty surprise

We wanted to decouple our tests from these concerns, in a way that would support both unit
level tests and end to end test. Bring in:

`data-test-id="some-test-id"`

This package give you the ability to strip these test id's from production code.

### Install

```bash
npm install babel-plugin-jsx-remove-data-test-id --save-dev
```

Add this to you babel config plugins

```javascript
plugins: ["babel-plugin-jsx-remove-data-test-id"];
```

In some configurations the above will strip out the test attribute before the tests are run, causing them to fail. If this is the case for your project, you'll need to limit the plugin to non-test environments.

```javascript
{
  env: {
    production: {
      plugins: ["babel-plugin-jsx-remove-data-test-id"]
    },
    test: {
      plugins: ["other-plugins"]
    }
  }
}
```

### How to use

Add `data-test-id` to your react components

```javascript
return (
  <div>
    <p data-test-id="component-text">{someText}</p>
  </div>
);
```

### Peer dependency warnings

This plugin specifies Babel 7 as its peer dependency - while it also works with Babel 6 you might want to install `@babel/core@6.0.0-bridge.1` to get rid of unmet peer dependency warnings.

### Define custom attribute name(s)

By default attributes with name `data-test-id` or `data-testid` (as used in [react-testing-library](https://testing-library.com/react)) will be stripped. You can also define custom attribute names via plugin options in your babel config:

```javascript
plugins: [
  [
    "babel-plugin-jsx-remove-data-test-id",
    {
      attributes: "selenium-id"
    }
  ]
];
```

Or if you need to strip off multiple attributes, you can define an attributes array as follows:

```javascript
plugins: [
  [
    "babel-plugin-jsx-remove-data-test-id",
    {
      attributes: ["data-test-id", "selenium-id", "another-attr-to-be-stripped"]
    }
  ]
];
```

Make sure the plugins are part of your babel config, and build away - that's it. `data-test-id`'s (respectively your custom named attributes) will be stripped.
