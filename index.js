export default function RemoveQAClasses({ types: t }) {

  return {
    visitor: {
      JSXOpeningElement: function transform(path, state) {
        if (path.node.hasStrippedQAClass) {
          return;
        }

        const validClassNameAttributes = attr => {
          const isIdent = (
            t.isIdentifier(attr.name, { name: 'className' }) // we might not need this line really
            || t.isJSXIdentifier(attr.name, { name: 'className' })
          );
          return t.isJSXAttribute(attr) && isIdent;
        };

        const classnameAttributes = path.node.attributes
          .filter(validClassNameAttributes);

        if (!classnameAttributes.length) {    
          // we have nothing to modifiy    
          return;
        }

        classnameAttributes.forEach((attr) => {
          if (t.isStringLiteral(attr.value)) {
            // we only handle string literals for qa-css-classes
            const classNameRegEx = /\s?qa-([-\w])*/g;
            const node = t.jSXOpeningElement(
              path.node.name,
              path.node.attributes.map(currentAttr => {
                if (attr !== currentAttr) {
                  return currentAttr;
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
