/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import CommentPane from '.';

describe('commentPane', () => {
  let onSave;
  let onClose;

  beforeEach(() => {
    onSave = jest.fn();
    onClose = jest.fn();
  });
  it('does not show a list of comments, just a commenting input, if selection not an existing comment', () => {
    const selection = 'new selection';
    const commentList = [
      {
        id: 'some-uuid',
        user: {
          id: 1,
          name: 'Some Guy',
        },
        comment: 'some comment',
        location: [0, 1],
      },
    ];
    const comments = shallow(
      <CommentPane
        selection={selection}
        commentList={commentList}
        onSave={onSave}
        onClose={onClose}
      />
    );
    expect(comments.find('[data-testid="comment-list"]')).toHaveLength(0);
    expect(comments.find('[data-testid="comment-input"]')).toHaveLength(1);
  });
  it('shows existing comments and a commenting input', () => {
    const selection = 'some-uuid';
    const commentList = [
      {
        id: 'some-uuid',
        user: {
          id: 1,
          name: 'Some Guy',
        },
        comment: 'some comment',
        location: [0, 1],
      },
    ];
    const comments = shallow(
      <CommentPane
        selection={selection}
        commentList={commentList}
        onSave={onSave}
        onClose={onClose}
      />
    );
    expect(comments.find('[data-testid="comment-list"]')).toHaveLength(1);
    expect(comments.find('[data-testid="comment-input"]')).toHaveLength(1);
  });
  it('does not save empty comments', () => {
    const comments = shallow(<CommentPane onSave={onSave} onClose={onClose} />);
    comments.find('[data-testid="comment-save"]').first().simulate('click');
    expect(onSave).not.toHaveBeenCalled();
  });
  it('saves and shows a new comment', () => {
    const testComment = 'test comment';
    const comments = shallow(<CommentPane onSave={onSave} onClose={onClose} />);
    comments
      .find('[data-testid="comment-input"]')
      .first()
      .simulate('change', { target: { value: testComment } });
    comments.find('[data-testid="comment-save"]').first().simulate('click');
    // todo use real location to show where the comment was
    expect(onSave).toHaveBeenCalledWith(testComment);
  });
  it('calls closehandler when closed', () => {
    const comments = shallow(<CommentPane onSave={onSave} onClose={onClose} />);
    comments.find('[data-testid="comment-close"]').simulate('click');
    expect(onClose).toHaveBeenCalled();
  });
});
