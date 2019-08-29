/* eslint-env jest */

import { mount } from 'enzyme';
import TextContent from '.';

describe('TextContent', () => {
  const fakeText = 'some text\nwith new lines';

  it('renders children in a formatted paragraph tag', () => {
    const textContent = mount(<TextContent>{fakeText}</TextContent>);
    expect(textContent.find('p').instance().innerHTML).toEqual(fakeText);
  });

  it('renders comments by adding marks to children', () => {
    const fakeComments = [
      {
        id: 'some-uuid',
        comment: 'Some Comment',
        user: {
          id: 1,
          name: 'Some Guy',
        },
        location: [5, 9],
      },
    ];
    const fakeTextWithComments = 'some <mark>text</mark>\nwith new lines';
    const textContent = mount(
      <TextContent commentList={fakeComments}>{fakeText}</TextContent>
    );
    expect(textContent.find('p').instance().innerHTML).toEqual(
      fakeTextWithComments
    );
  });

  it('calls the click handler with the id of the comment', () => {
    // todo use one comment id for each stringn of comments
    expect(false).toBe(true);
  });
});
