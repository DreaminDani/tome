export const getDisplayNameFromName = (name) => {
  if (name && typeof name === 'string') {
    return name;
  }

  if (name && typeof name === 'object' && name.givenName && name.familyName) {
    return `${name.givenName} ${name.familyName}`;
  }

  if (name && typeof name === 'object' && name.given_name && name.family_name) {
    return `${name.given_name} ${name.family_name}`;
  }

  return 'A tome user';
};
