import { readOutput, assertRemoved, assertKept } from '../check-helpers.mjs';

assertRemoved(readOutput('dist'), ['data-testid']);
assertKept(readOutput('dist-test'), ['data-testid']);
