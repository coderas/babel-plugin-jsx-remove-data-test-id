const RemoveQAClasses = ({ types: t }) => {
  const visitor = {
    JSXOpeningElement: (path, state) => {
      if (path.node.hasStrippedQAClass) {
        return;
      }

      let attributeIdentifiers = ['className'];

      if (state.opts && state.opts.attributes) {
        attributeIdentifiers = [attributeIdentifiers, ...state.opts.attributes];
      }

      const classNameRegEx = /(^qa-([-\w])*|\sqa-([-\w])*)/g;
      let newClassNameValue;

      const validClassNameAttributes = attr => {
        const isIdent = attributeIdentifiers.find(
          attribute => {
            return t.isJSXIdentifier(attr.name, { name: attribute });
          }
        );
        return t.isJSXAttribute(attr) && isIdent;
      };

      const isStringLiteral = attr => t.isStringLiteral(attr.value);

      const replaceClassNameValues = attr => {
        const replaceQAClassName = currentAttr => {
          if (attr !== currentAttr) {
            return currentAttr;
          }
          newClassNameValue = attr.value.value.replace(classNameRegEx, '').trim();

          if (newClassNameValue.length) {
            return t.jSXAttribute(
              t.jSXIdentifier(attr.name.name),
              t.stringLiteral(newClassNameValue)
            );
          }
        };

        const isDefined = value => typeof value !== 'undefined';

        const attrs = (
          path.node.attributes
            .map(replaceQAClassName)
            .filter(isDefined)
        );

        const node = t.jSXOpeningElement(
          path.node.name,
          attrs,
          path.node.selfClosing
        );
        node.hasStrippedQAClass = true;
        path.replaceWith(node);
      };

      path.node.attributes
        .filter(validClassNameAttributes)
        .filter(isStringLiteral)
        .forEach(replaceClassNameValues);
    }
  };

  return {
    visitor
  };
};

export default RemoveQAClasses;
