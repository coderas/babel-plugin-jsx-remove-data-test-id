import { readOutput, assertRemoved, assertKept } from '../check-helpers.mjs';

const output = readOutput('dist');
assertRemoved(output, ['data-test-id', 'data-testid']);
assertKept(output, ['className']);
