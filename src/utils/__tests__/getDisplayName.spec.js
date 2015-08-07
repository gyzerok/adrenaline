import test from 'tape';
import getDisplayName from '../getDisplayName';

test('getDisplayName should return String or Component for empty object', assert => {
  const mapped = [
    { displayName: 'hey' },
    { name: 'ho' },
    {}
  ].map(getDisplayName);

  assert.deepEqual(mapped, ['hey', 'ho', 'Component']);

  assert.end();
});
