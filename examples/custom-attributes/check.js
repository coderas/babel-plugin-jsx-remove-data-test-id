const { readOutput, assertRemoved, assertKept } = require('../check-helpers');

const output = readOutput('dist');
assertRemoved(output, ['data-cy', 'data-qa']);
assertKept(output, ['data-test-id']);
