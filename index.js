export default function RemoveQAClasses({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement: function transform(path) {
        const validClassNameAttributes = attr => {
          const isIdent = (
            t.isJSXIdentifier(attr.name, { name: 'className' })
          );
          return t.isJSXAttribute(attr) && isIdent;
        };

        const classnameAttributes = path.node.attributes.filter(validClassNameAttributes);

        if (!classnameAttributes.length) {
          return;
        }

        classnameAttributes.forEach(attr => {
          if (!t.isStringLiteral(attr.value)) {
            return;
          }

          const classNameRegEx = /\s?qa-([-\w])*/g;

          const removeQAClassNames = currentAttr => {
            if (attr !== currentAttr) {
              return currentAttr;
            }
            const newClassNameValue = attr.value.value.replace(classNameRegEx, '').trim();

            return t.jSXAttribute(
              t.jSXIdentifier(attr.name.name),
              t.stringLiteral(newClassNameValue)
            );
          };
          
          const attrs = path.node.attributes.map(removeQAClassNames);

          const node = t.jSXOpeningElement(
            path.node.name,
            attrs,
            path.node.selfClosing
          );
          path.replaceWith(node);
        });
      }
    },
  };
}
