import * as babel6 from 'babel-core';
import * as babel7 from '@babel/core';
import { expect } from 'chai';
import { minify } from 'uglify-js';

const uglify = code => minify(code, {
  fromString: true,
  mangle: false
}).code;

const runTests = (label, transform) => {
  describe(label, () => {
    describe('jsx-remove-data-test-id', () => {
      it('does not replace data-something-else', () => {
        const code = '<p data-something-else="cake-day">hi, finally it is cake time</p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(code);
        expect(uglify(actual)).to.equal(uglify(expected));
      });

      it('does not remove attributes that contain "data-test-id" in part only', () => {
        const code = '<p data-test-id-not="not-test-id">hi, finally it is cake time</p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(code);
        expect(uglify(actual)).to.equal(uglify(expected));
      });

      it('removes data-test-id', () => {
        const code = '<p data-test-id="test-id"></p>';
        const expectedCode = '<p></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        expect(uglify(actual)).to.equal(uglify(expected));
      });

      it('removes data-test-id inside of other attributes that are passed in as objects', () => {
        const code = '<p someOtherAttribute={{ "data-test-id": "should-be-removed" }} someOtherAttributeKeep={{ className: "should-keep" }}></p>';
        const expectedCode = '<p someOtherAttributeKeep={{ className: "should-keep" }}></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        expect(uglify(actual)).to.equal(uglify(expected));
      });

      it('removes data-test-id funcs', () => {
        const code = '<p data-test-id={() => {}}></p>';
        const expectedCode = '<p></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        expect(uglify(actual)).to.equal(uglify(expected));
      });

      it('removes data-test-id bools', () => {
        const code = '<p data-test-id={false}></p>';
        const expectedCode = '<p></p>';
        const actual = transform(code, { usePlugin: true });
        const expected = transform(expectedCode);
        expect(uglify(actual)).to.equal(uglify(expected));
      });

      describe('with invalid options.attributes', () => {
        it('throws error when attributes is empty string', () => {
          const code = '<p selenium-id={false}></p>';
          const action = () => transform(code, {
            useErroneousAttributes: true,
            attributes: ''
          });
          expect(action).to.throw();
        });

        it('throws error when attributes is empty array', () => {
          const code = '<p selenium-id={false}></p>';
          const expectedCode = '<p></p>';
          const action = () => transform(code, {
            useErroneousAttributes: true,
            attributes: []
          });
          expect(action).to.throw();
        });
      })

      describe('with valid options.attributes', () => {
        it('does not remove attributes that match options.attributes in part only', () => {
          const code = '<p selenium-id-not="not-test-id" no-useless-attr="useless">hi, finally it is cake time</p>';
          const actual = transform(code, { useValidAttributes: true });
          const expected = transform(code);
          expect(uglify(actual)).to.equal(uglify(expected));
        });

        it('removes options.attributes', () => {
          const code = '<p selenium-id="test-id" useless-attr="useless"></p>';
          const expectedCode = '<p></p>';
          const actual = transform(code, { useValidAttributes: true });
          const expected = transform(expectedCode);
          expect(uglify(actual)).to.equal(uglify(expected));
        });

        it('removes options.attributes funcs', () => {
          const code = '<p selenium-id={() => {}} useless-attr={() => {}}></p>';
          const expectedCode = '<p></p>';
          const actual = transform(code, { useValidAttributes: true });
          const expected = transform(expectedCode);
          expect(uglify(actual)).to.equal(uglify(expected));
        });

        it('removes options.attributes bools', () => {
          const code = '<p selenium-id={false} useless-attr={true}></p>';
          const expectedCode = '<p></p>';
          const actual = transform(code, { useValidAttributes: true });
          const expected = transform(expectedCode);
          expect(uglify(actual)).to.equal(uglify(expected));
        });
      })
    });
  })
}

runTests(
    "babel6",
    (
        code,
        {
          useErroneousAttributes = false,
          useValidAttributes = false,
          usePlugin = false,
          attributes
        } = {}
    ) => {
      let plugins;
      if (useErroneousAttributes) {
        plugins = [
          ["./src", { attributes }],
          ["transform-react-jsx", { pragma: "j" }],
          ["transform-es2015-arrow-functions", {}]
        ];
      } else if (useValidAttributes) {
        plugins = [
          ["./src", { attributes: ["selenium-id", "useless-attr"] }],
          ["transform-react-jsx", { pragma: "j" }],
          ["transform-es2015-arrow-functions", {}]
        ];
      } else {
        plugins = [
          usePlugin && "./src",
          ["transform-react-jsx", { pragma: "j" }],
          ["transform-es2015-arrow-functions", {}]
        ].filter(Boolean);
      }
      return babel6.transform(code, { plugins }).code;
    }
);
runTests(
    "babel7",
    (
        code,
        {
          useErroneousAttributes = false,
          useValidAttributes = false,
          usePlugin = false,
          attributes
        } = {}
    ) => {
      let plugins
      if (useErroneousAttributes) {
        plugins = [
          ['./src', { attributes }],
          ["@babel/transform-react-jsx", { pragma: "j" }],
          ["@babel/transform-arrow-functions", {}]
        ]
      } else if (useValidAttributes) {
        plugins = [
          ['./src', { attributes: ['selenium-id', 'useless-attr'] }],
          ["@babel/transform-react-jsx", { pragma: "j" }],
          ["@babel/transform-arrow-functions", {}]
        ]
      } else {
        plugins = [
          usePlugin && "./src",
          ["@babel/transform-react-jsx", { pragma: "j" }],
          ["@babel/transform-arrow-functions", {}]
        ].filter(Boolean)
      }
      return babel7.transformSync(code, { plugins }).code;
    }
);
