/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import CommentList from '.';

describe('commentList', () => {
  it('displays a single comment', () => {
    const commentListItems = [
      {
        id: 'some-uuid',
        user: {
          id: 1,
          name: 'Some Guy',
        },
        comment: 'some comment',
      },
    ];
    const commentList = shallow(<CommentList items={commentListItems} />);
    expect(commentList.find('[data-testid="comment-list-item"]')).toHaveLength(
      1
    );
  });
  it('displays a list of comments', () => {
    const commentListItems = [
      {
        id: 'some-uuid1',
        user: {
          id: 1,
          name: 'Some Guy',
        },
        comment: 'some comment',
      },
      {
        id: 'some-uuid2',
        user: {
          id: 2,
          name: 'Some Other Guy',
        },
        comment: 'some comment',
      },
    ];
    const commentList = shallow(<CommentList items={commentListItems} />);
    expect(commentList.find('[data-testid="comment-list-item"]')).toHaveLength(
      2
    );
  });
});
