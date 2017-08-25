## babel-plugin-jsx-remove-data-test-id

Remove `data-test-id` attributes from your production builds.

### Motivation
It's not usually a good idea to couple our test code with DOM element id's or CSS classnames.
* Finding by an ```.o-some-class``` or ```#some-id``` selector couples our test to the CSS; making changes can be expensive from a maintainance point of view, whether they are coming from the CSS or the tests
* Finding elements by DOM tag, such as ```<span />``` or ```<p>``` can be equally as difficult to maintain; these things move around so if your looking for ```.first()``` you might get a nasty surprise

We wanted to decouple our tests from these concerns, in a way that would support both unit
level tests and end to end test. Bring in:

```data-test-id="some-test-id"```

This package give you the ability to strip these test id's from production code.

### Install

```bash
npm install babel-plugin-jsx-remove-data-test-id --save-dev
```

Add this to you babel config plugins

```javascript
plugins: [
    'babel-plugin-jsx-remove-data-test-id'
]
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

Make sure the plugins are part of your webpack build, and that's it. ```data-test-id```'s will be stripped.
