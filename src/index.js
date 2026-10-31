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

const RemoveDataTestIds = ({ types: t }, options) => {
  const attributeIdentifiers = getAttributeIdentifiers(options);

  const visitor = {
    ObjectProperty: path => {
      const isTestIdProperty = (key) => {
        return attributeIdentifiers.find((attribute) => {
          return t.isStringLiteral(key, { value: attribute })
        });
      };
  
      if (isTestIdProperty(path.node.key))
        path.remove();
    },
    JSXAttribute: path => {
      const isTestIdAttribute = attributeIdentifiers.some(attribute =>
        t.isJSXIdentifier(path.node.name, { name: attribute })
      );

      if (isTestIdAttribute) {
        path.remove();
      }
    }
  };

  return {
    visitor
  };
};

module.exports = RemoveDataTestIds;
module.exports.default = RemoveDataTestIds;
