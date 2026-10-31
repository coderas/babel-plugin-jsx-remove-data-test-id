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
- [Upgrading to 3.0](#upgrading-to-30)
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

The plugin works with Babel 7 and Babel 8 (`@babel/core` `^7.0.0 || ^8.0.0`). It uses the Babel version that your project has installed.

## Usage

Add the plugin to your Babel config, for example `babel.config.json`:

```json
{
  "plugins": ["babel-plugin-jsx-remove-data-test-id"]
}
```

By default, the plugin removes `data-test-id` and `data-testid` (the attribute that [React Testing Library](https://testing-library.com/docs/queries/bytestid) uses).

The plugin config is the same for Babel 7 and Babel 8. The JSX preset config is different: in Babel 8, `@babel/preset-react` uses the automatic JSX runtime by default. In Babel 7, you must set it:

```json
{
  "presets": [["@babel/preset-react", { "runtime": "automatic" }]],
  "plugins": ["babel-plugin-jsx-remove-data-test-id"]
}
```

The plugin works with the classic runtime and with the automatic runtime.

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

| Example | Babel | Shows |
|---|---|---|
| [basic](examples/basic) | 8 | The default attributes, in JSX and in spread props |
| [custom-attributes](examples/custom-attributes) | 8 | The `attributes` option |
| [keep-in-tests](examples/keep-in-tests) | 8 | Production-only removal with Babel `env` |
| [babel-7](examples/babel-7) | 7 | The `basic` example with Babel 7 |

To run an example:

```bash
cd examples/basic
npm install
npm test
```

`npm test` in each example compiles `src/` to `dist/` and checks the output.

## Compatibility

| Plugin version | Babel | Node.js |
|---|---|---|
| 3.x | 7 and 8 | 22 or later |
| 2.x | 6 and 7 | any |

## Upgrading to 3.0

- **Babel 7 and Babel 8.** Babel 6 is not supported. If you use Babel 6, stay on 2.x.
- **Node.js 22 or later.** CI tests Node.js 22, 24 and 26.
- **The package entry moved** from `lib/index.js` to `src/index.js`. If you load the plugin by its package name, nothing changes. If you import `babel-plugin-jsx-remove-data-test-id/lib/index.js` directly, use the package name instead.
- **Invalid options fail earlier.** The plugin checks the `attributes` option when Babel loads it, so an invalid value fails for every file, not only for files that contain a matching attribute.
- **TSX type arguments are kept.** In 2.x, `<Select<Option> data-test-id="x" />` became `<Select />`. In 3.x, it becomes `<Select<Option> />`.
- The attributes that the plugin removes do not change.

## Development

```bash
npm install
npm test
```

The tests use the Node.js test runner (`node:test`). The plugin has no build step: the package ships `src/index.js`.

CI runs the tests with Babel 7 and Babel 8, and the examples, on Node.js 22, 24 and 26.

## License

[MIT](LICENSE)
