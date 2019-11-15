const getAttributeIdentifiers = options => {
  if (!options || typeof options.attributes === "undefined")
    return ["data-test-id", "data-testid"];

  if (Array.isArray(options.attributes)) {
    if (options.attributes.length === 0) {
      throw new Error(
        "option attributes must be an array with at least one element"
      );
    }

    if (
      options.attributes.length !==
      options.attributes.filter(attr => attr && typeof attr === "string").length
    ) {
      throw new Error(
        "all items in the option attributes must be non empty strings"
      );
    }

    return options.attributes;
  }

  if (!options.attributes || typeof options.attributes !== "string") {
    throw new Error(
      "option attributes must be a non empty string or an array with non empty strings"
    );
  }

  return [options.attributes];
};

const RemoveDataTestIds = ({ types: t }) => {
  const visitor = {
    JSXOpeningElement: (path, state) => {
      if (path.node.hasStripped) {
        return;
      }

      const attributeIdentifiers = getAttributeIdentifiers(state.opts);

      const validTestIdAttributes = attr => {
        const isIdent = attributeIdentifiers.find(attribute => {
          return t.isJSXIdentifier(attr.name, { name: attribute });
        });
        return t.isJSXAttribute(attr) && isIdent;
      };

      const replaceClassNameValues = attr => {
        const matchingAttrs = currentAttr => {
          if (attr !== currentAttr) {
            return currentAttr;
          }
        };

        const isDefined = value => typeof value !== "undefined";

        const attrs = path.node.attributes.map(matchingAttrs).filter(isDefined);

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

      const isObjectDefined = value => Object.keys(value).length !== 0;

      const matchAndReplaceValues = ({ value = {}, ...currentAttr }) => {
        const { expression: { properties = [] } = {} } = value || {};

        const filteredProperties = properties.filter(property =>
          attributeIdentifiers.includes(property.key.value)
        );
        if (filteredProperties.length === 0) {
          return {
            ...currentAttr,
            value,
            properties: filteredProperties
          };
        }
        return {};
      };

      const attrs = path.node.attributes
        .map(matchAndReplaceValues)
        .filter(isObjectDefined);

      const node = t.jSXOpeningElement(
        path.node.name,
        attrs,
        path.node.selfClosing
      );
      node.hasStripped = true;
      path.replaceWith(node);
    }
  };

  return {
    visitor
  };
};

export default RemoveDataTestIds;
