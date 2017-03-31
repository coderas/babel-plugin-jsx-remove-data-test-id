const RemoveDataTestIds = ({ types: t }) => {
  const visitor = {
    JSXOpeningElement: (path, state) => {
      if (path.node.hasStripped) {
        return;
      }

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
        const matchingAttrs = currentAttr => {
          if (attr !== currentAttr) {
            return currentAttr;
          }
        };

        const isDefined = value => typeof value !== 'undefined';

        const attrs = (
          path.node.attributes
            .map(matchingAttrs)
            .filter(isDefined)
        );

        const node = t.jSXOpeningElement(
          path.node.name,
          attrs,
          path.node.selfClosing
        );
        node.hasStripped = true;
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

export default RemoveDataTestIds;
