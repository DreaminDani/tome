import { getDisplayNameFromName } from './helpers';

describe('getDisplayNameFromName', () => {
  it("returns the name, if it's a string", () => {
    const name = 'My Name';
    expect(getDisplayNameFromName(name)).toEqual(name);
  });

  it('returns the givenName and familyName together', () => {
    const name = { givenName: 'My', familyName: 'Name' };
    expect(getDisplayNameFromName(name)).toEqual('My Name');
  });

  it('returns the given_name and family_name together', () => {
    const name = { given_name: 'My', family_name: 'Name' };
    expect(getDisplayNameFromName(name)).toEqual('My Name');
  });

  it('gracefully handles a null name', () => {
    const name = null;
    expect(getDisplayNameFromName(name)).toEqual('A tome user');
  });

  it('gracefully handles an empty name', () => {
    const name = '';
    expect(getDisplayNameFromName(name)).toEqual('A tome user');
  });

  it('gracefully handles an unexpected format', () => {
    const name = { givenName: 'My', family_name: 'Name' };
    expect(getDisplayNameFromName(name)).toEqual('A tome user');
  });
});
