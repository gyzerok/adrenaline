import test from 'tape';
import getDisplayName from '../getDisplayName';

test('getDisplayName should return Component for empty object', assert => {
  assert.equal(getDisplayName({}), 'Component');

  assert.end();
});
