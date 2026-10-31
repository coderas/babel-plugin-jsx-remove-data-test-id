# babel-plugin-jsx-remove-data-test-id

[![CI](https://github.com/coderas/babel-plugin-jsx-remove-data-test-id/actions/workflows/ci.yml/badge.svg)](https://github.com/coderas/babel-plugin-jsx-remove-data-test-id/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/babel-plugin-jsx-remove-data-test-id.svg)](https://www.npmjs.com/package/babel-plugin-jsx-remove-data-test-id)

A Babel plugin that removes test attributes such as `data-test-id` and `data-testid` from JSX, so they do not ship in your production builds.

**In:**

```jsx
<button data-test-id="submit-button" className="button">
  Save
</button>
```

**Out:**

```jsx
<button className="button">Save</button>
```

## Contents

- [Why](#why)
- [Install](#install)
- [Usage](#usage)
- [Keep test ids in your tests](#keep-test-ids-in-your-tests)
- [Options](#options)
- [What is removed](#what-is-removed)
- [Examples](#examples)
- [Compatibility](#compatibility)
- [Development](#development)
- [License](#license)

## Why

Tests that find elements by CSS class, id or tag break when the markup or the styles change. A dedicated test attribute decouples your unit and end-to-end tests from those concerns:

```jsx
<p data-test-id="component-text">{someText}</p>
```

These attributes have no use in production. This plugin removes them at build time.

## Install

```bash
npm install --save-dev babel-plugin-jsx-remove-data-test-id
```

## Usage

Add the plugin to your Babel config, for example `babel.config.json`:

```json
{
  "plugins": ["babel-plugin-jsx-remove-data-test-id"]
}
```

By default, the plugin removes `data-test-id` and `data-testid` (the attribute that [React Testing Library](https://testing-library.com/docs/queries/bytestid) uses).

## Keep test ids in your tests

If your tests use the same Babel config, the plugin also removes the attributes before your tests run, and the tests fail. Enable the plugin for production builds only:

```json
{
  "env": {
    "production": {
      "plugins": ["babel-plugin-jsx-remove-data-test-id"]
    }
  }
}
```

Babel selects the `env` block from `BABEL_ENV`, or from `NODE_ENV` when `BABEL_ENV` is not set. Jest sets `NODE_ENV=test`, so the plugin does not run in your tests. See [examples/keep-in-tests](examples/keep-in-tests).

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `attributes` | `string` or `string[]` | `["data-test-id", "data-testid"]` | The attribute names to remove. |

```json
{
  "plugins": [
    ["babel-plugin-jsx-remove-data-test-id", { "attributes": ["data-cy", "data-qa"] }]
  ]
}
```

`attributes` replaces the defaults. To remove `data-test-id` as well as your own names, include it in the list.

The plugin throws an error when `attributes` is not a non-empty string or a non-empty array of non-empty strings.

## What is removed

- **JSX attributes** whose name matches exactly: `<p data-test-id="x" />`. `data-test-id-extra` is not removed.
- **Object properties** whose key is a matching string literal: `{ 'data-test-id': 'x' }`. This covers props that you spread into JSX, and JSX that an earlier step has already compiled to `React.createElement` or `jsx()` calls.

Object properties are removed from every object in the files that Babel transforms, not only from JSX props.

The plugin does not change values at runtime. For example, it cannot remove an attribute that is added from a computed key such as `{ [name]: 'x' }`.

## Examples

The [examples](examples) folder has small projects that you can run:

| Example | Shows |
|---|---|
| [basic](examples/basic) | The default attributes, in JSX and in spread props |
| [custom-attributes](examples/custom-attributes) | The `attributes` option |
| [keep-in-tests](examples/keep-in-tests) | Production-only removal with Babel `env` |

To run an example, build the plugin first:

```bash
npm install
npm run build
cd examples/basic
npm install
npm test
```

`npm test` in each example compiles `src/` to `dist/` and checks the output.

## Compatibility

| Plugin version | Babel |
|---|---|
| 3.x | 7 |
| 2.x | 6 and 7 |

Version 3.0.0 ends Babel 6 support. If you use Babel 6, use version 2.x.

## Development

```bash
npm install
npm test
npm run build
```

CI runs the tests, the build and the examples on Node 20, 22 and 24.

## License

[MIT](LICENSE)
