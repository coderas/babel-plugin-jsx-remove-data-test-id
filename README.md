## babel-plugin-jsx-remove-qa

Remove QA classes from your production builds.

### Motivation
It's not a good idea to hang unit tests off production CSS classes or DOM elements for a couple of reasons:
* Finding by an ```.o-some-class``` selector couples our test to the CSS; making changes can be expensive from a maintainance point of view, whether they are coming from the CSS or the tests
* Finding elements by DOM tag, such as ```<span />``` or ```<p>``` can be equally as difficult to maintain; these things move around so if your looking for ```.first()``` you might get a nasty surprise

We wanted to decouple our tests from the production CSS, but quite liked what class selectors gave us, so we started to add ```className="qa-some-class"``` to our React components.

This is good because, by convention, our UI guys never style to these classes so when we want to move stuff around - we just do it, and so do they.

The problem is, left untreated, these things can makes their way into your production code. Not good.

### Install

```bash
npm install babel-plugin-jsx-remove-qa --save-dev
```

Add this to you babel config plugins

```javascript
plugins: [
    'babel-plugin-jsx-remove-qa',
    {
        attributes: ['cssClassName'] // Another attribute you might want to remove
    }
]
```

### How to use
Add classnames to your react components

```javascript
return (
    <div>
        <p className="qa-component-text">{someText}</p>
        <ChildComponent cssClassName="qa-child-component" {...props] />
    </div>
);
```

Make sure the plugins are part of your webpack build, and that's it. ```.qa-classes``` will be stripped.

At the moment this only works on string literals, but at some point we'll be adding support for expressions too.

## Important
Please use with care, this is an experimental plugin, intended to be replaced with a full featured version.
