import fs from 'fs';
import path from 'path';

function simpleCache(f) {
  const cache = {};
  return (k) => {
    if (!cache[k]) {
      cache[k] = f(k);
    }
    return cache[k];
  };
}

export default function EncapsulateJsx({ types: t }) {

  return {
    visitor: {
      JSXOpeningElement: function transform(path, state) {
        if (path.node.hasStrippedQAClass) {
          return;
        }

        const validClassNameAttributes = node => {
          const isIdent = (
            t.isIdentifier(n, { name: 'className' })
            || t.isJSXIdentifier(node, { name: 'className' })
          );
          return t.isJSXAttribute(a) && isIdent;
        };

        const classnameAttributes = path.node.attributes
          .filter(validClassNameAttributes);

        if (!classnameAttributes.length) {    
          // we have nothing to modifiy    
          node.hasStrippedQAClass = true;           
          return;
        }

        classnameAttributes.forEach((attr) => {
          if (t.isStringLiteral(attr.value)) {
            // we only handle string literals for qa-css-classes
            const classNameRegEx = /\s?qa-([-\w])*/g;
            const node = t.jSXOpeningElement(
              path.node.name,
              path.node.attributes.map((curAttr) => {
                if (attr !== curAttr) {
                  return curAttr;
                }
                const newCssClassNameValue = attr.value.value.replace(classNameRegEx, '');

                return t.jSXAttribute(
                  t.jSXIdentifier('className'),
                  t.stringLiteral(newCssClassNameValue)
                );
              }),
              path.node.selfClosing
            );
            path.replaceWith(node);
            node.hasStrippedQAClass = true;
          }
        });
      }
    },
  };
}
