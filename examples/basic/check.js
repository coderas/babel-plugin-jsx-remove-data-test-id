const { readOutput, assertRemoved, assertKept } = require('../check-helpers');

const output = readOutput('dist');
assertRemoved(output, ['data-test-id', 'data-testid']);
assertKept(output, ['className']);
