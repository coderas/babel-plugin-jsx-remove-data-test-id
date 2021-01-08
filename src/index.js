const getAttributeIdentifiers = options => {
  if(!options || typeof(options.attributes) === 'undefined') return ['data-test-id', 'data-testid'];
  
  if(Array.isArray(options.attributes)) {
    if(options.attributes.length === 0) {
      throw new Error('option attributes must be an array with at least one element');
    }
    
    if (options.attributes.length !==  options.attributes.filter(attr => attr && typeof(attr) === 'string').length) {
      throw new Error('all items in the option attributes must be non empty strings');
    }
    
    return options.attributes;
  }
  
  if(!options.attributes || typeof(options.attributes) !== 'string') {
    throw new Error('option attributes must be a non empty string or an array with non empty strings');
  }
  
  return [options.attributes];
}

const RemoveDataTestIds = ({ types: t }) => {
  const visitor = {
    ObjectProperty: (path, state) => {
      const attributeIdentifiers = getAttributeIdentifiers(state.opts);
  
      const isTestIdProperty = (key) => {
        return attributeIdentifiers.find((attribute) => {
          return t.isStringLiteral(key, { value: attribute })
        });
      };
  
      if (isTestIdProperty(path.node.key))
        path.remove();
    },
    JSXOpeningElement: (path, state) => {
      if (path.node.hasStripped) {
        return;
      }

      const attributeIdentifiers = getAttributeIdentifiers(state.opts);

      const validTestIdAttributes = attr => {
        const isIdent = attributeIdentifiers.find(
          attribute => {
            return t.isJSXIdentifier(attr.name, { name: attribute });
          }
        );
        return t.isJSXAttribute(attr) && isIdent;
      };

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
        .filter(validTestIdAttributes)
        .forEach(replaceClassNameValues);
    }
  };

  return {
    visitor
  };
};

export default RemoveDataTestIds;
