jest.autoMockOff();

describe('getDisplayName', () => {
  it('should return component for undefined', () => {
    const getDisplayName = require('../getDisplayName');

    expect(getDisplayName({})).toEqual('Component');
  });
});
