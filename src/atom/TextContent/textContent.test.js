/* eslint-env jest */

import { shallow } from 'enzyme';
import TextContent from '.';

describe('TextContent', () => {
  const fakeText = `
  some text
    with new lines
  `;

  it('renders children in a formatted paragraph tag', () => {
    const textContent = shallow(<TextContent>{fakeText}</TextContent>);
    expect(textContent.find('p').prop('children')).toEqual(fakeText);
  });
});
