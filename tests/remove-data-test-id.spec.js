const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const babel7 = require('@babel/core');
const babel8 = require('babel-8-core');

const runTests = (label, transform) => {
  describe(label, () => {
    describe('jsx-remove-data-test-id', () => {
      it('does not replace data-something-else', () => {
        const code = '<p data-something-else="cake-day">hi, finally it is cake time</p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(code);
        assert.equal(actual, expected);
      });

      it('does not remove attributes that contain "data-test-id" in part only', () => {
        const code = '<p data-test-id-not="not-test-id">hi, finally it is cake time</p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(code);
        assert.equal(actual, expected);
      });

      it('removes data-test-id', () => {
        const code = '<p data-test-id="test-id"></p>';
        const expectedCode = '<p></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        assert.equal(actual, expected);
      });

      it('removes data-test-id funcs', () => {
        const code = '<p data-test-id={() => {}}></p>';
        const expectedCode = '<p></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        assert.equal(actual, expected);
      });

      it('removes data-test-id bools', () => {
        const code = '<p data-test-id={false}></p>';
        const expectedCode = '<p></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        assert.equal(actual, expected);
      });

      it('removes data-test-id properties from objects and their nested objects', () => {
        const code = '<p object={{"data-test-id": "test-id", something: "else"}}></p>';
        const expectedCode = '<p object={{something: "else"}}></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        assert.equal(actual, expected);
      })
      
      it('removes data-test-id properties from nested objects', () => {
        const code = '<p object={{nested: {"data-test-id": "test-id"}}}></p>';
        const expectedCode = '<p object={{nested:{}}}></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        assert.equal(actual, expected);
      })

      it('does not remove empty object expressions and their relative JSX attributes', () => {
        const code = '<p object={{"data-test-id": "test-id"}}></p>';
        const expectedCode = '<p object={{}}></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        assert.equal(actual, expected);
      })
      
      it('does not remove properties that contain "data-test-id" in part only', () => {
        const code = '<p object={{"data-test-id-not": "test-id", nestedObj: {"data-test-id-not": "test-id"}}}></p>';
        const expectedCode = '<p object={{"data-test-id-not": "test-id", nestedObj:{"data-test-id-not": "test-id"}}}></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        assert.equal(actual, expected);
      })
      
      describe('with invalid options.attributes', () => {
        it('throws error when attributes is empty string', () => {
          const code = '<p selenium-id={false}></p>';
          const expectedCode = '<p></p>';
          const action = () => transform(code, {
            useErroneousAttributes: true,
            attributes: ''
          });
          assert.throws(action);
        });

        it('throws error when attributes is empty array', () => {
          const code = '<p selenium-id={false}></p>';
          const expectedCode = '<p></p>';
          const action = () => transform(code, {
            useErroneousAttributes: true,
            attributes: []
          });
          assert.throws(action);
        });
      })

      describe('with valid options.attributes', () => {
        it('does not remove attributes that match options.attributes in part only', () => {
          const code = '<p selenium-id-not="not-test-id" no-useless-attr="useless">hi, finally it is cake time</p>';
          const actual = transform(code, { useValidAttributes: true });
          const expected = transform(code);
          assert.equal(actual, expected);
        });

        it('removes options.attributes', () => {
          const code = '<p selenium-id="test-id" useless-attr="useless"></p>';
          const expectedCode = '<p></p>';
          const actual = transform(code, { useValidAttributes: true });
          const expected = transform(expectedCode);
          assert.equal(actual, expected);
        });

        it('removes options.attributes funcs', () => {
          const code = '<p selenium-id={() => {}} useless-attr={() => {}}></p>';
          const expectedCode = '<p></p>';
          const actual = transform(code, { useValidAttributes: true });
          const expected = transform(expectedCode);
          assert.equal(actual, expected);
        });

        it('removes options.attributes bools', () => {
          const code = '<p selenium-id={false} useless-attr={true}></p>';
          const expectedCode = '<p></p>';
          const actual = transform(code, { useValidAttributes: true });
          const expected = transform(expectedCode);
          assert.equal(actual, expected);
        });
      })
    });
  })
}

const babels = [
  ['babel 7', babel7],
  ['babel 8', babel8]
];

babels.forEach(([label, babel]) => {
  runTests(
    label,
    (
      code,
      {
        useErroneousAttributes = false,
        useValidAttributes = false,
        usePlugin = false,
        attributes
      } = {}
    ) => {
      let plugins = [];
      if (useErroneousAttributes) {
        plugins = [['./src', { attributes }]];
      } else if (useValidAttributes) {
        plugins = [['./src', { attributes: ['selenium-id', 'useless-attr'] }]];
      } else if (usePlugin) {
        plugins = ['./src'];
      }
      return babel.transformSync(code, { plugins, parserOpts: { plugins: ['jsx'] } }).code;
    }
  );

  describe(`${label} typescript`, () => {
    const transformTsx = (code, plugins) => babel.transformSync(code, {
      plugins,
      parserOpts: { plugins: ['jsx', 'typescript'] }
    }).code;

    it('keeps type arguments on elements that lose a data-test-id', () => {
      const actual = transformTsx('<Select<Option> data-test-id="select" value={value} />', ['./src']);
      const expected = transformTsx('<Select<Option> value={value} />', []);
      assert.equal(actual, expected);
    });
  });
});
