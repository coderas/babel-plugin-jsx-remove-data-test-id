import { readOutput, assertRemoved, assertKept } from '../check-helpers.mjs';

const output = readOutput('dist');
assertRemoved(output, ['data-cy', 'data-qa']);
assertKept(output, ['data-test-id']);
