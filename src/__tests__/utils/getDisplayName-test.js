jest.dontMock('../../utils/getDisplayName');

describe('getDisplayName', () => {
  it('should return component for undefined', () => {
    const getDisplayName = require('../../utils/getDisplayName');

    expect(getDisplayName({})).toEqual('Component');
  });
});
