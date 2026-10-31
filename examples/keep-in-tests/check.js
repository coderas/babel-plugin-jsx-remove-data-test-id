const { readOutput, assertRemoved, assertKept } = require('../check-helpers');

assertRemoved(readOutput('dist'), ['data-testid']);
assertKept(readOutput('dist-test'), ['data-testid']);
