jest.autoMockOff();

describe('getDisplayName', () => {
  it('should return component for undefined', () => {
    const getDisplayName = require('../../utils/getDisplayName');

    expect(getDisplayName({})).toEqual('Component');
  });
});
