'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  var visitor = {
    JSXOpeningElement: function JSXOpeningElement(path, state) {
      if (path.node.hasStripped) {
        return;
      }

      var attributeIdentifiers = ['data-test-id'];

      var validTestIdAttributes = function validTestIdAttributes(attr) {
        var isIdent = attributeIdentifiers.find(function (attribute) {
          return t.isJSXIdentifier(attr.name, { name: attribute });
        });
        return t.isJSXAttribute(attr) && isIdent;
      };

      var replaceClassNameValues = function replaceClassNameValues(attr) {
        var matchingAttrs = function matchingAttrs(currentAttr) {
          if (attr !== currentAttr) {
            return currentAttr;
          }
        };

        var isDefined = function isDefined(value) {
          return typeof value !== 'undefined';
        };

        var attrs = path.node.attributes.map(matchingAttrs).filter(isDefined);

        var node = t.jSXOpeningElement(path.node.name, attrs, path.node.selfClosing);
        node.hasStripped = true;
        path.replaceWith(node);
      };

      path.node.attributes.filter(validTestIdAttributes).forEach(replaceClassNameValues);
    }
  };

  return {
    visitor: visitor
  };
};

module.exports = exports["default"];