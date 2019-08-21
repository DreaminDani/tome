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
  it('shows a commenting interface', () => {
    const comments = shallow(<CommentPane onSave={onSave} onClose={onClose} />);
    expect(comments.find('[data-testid="comment-input"]')).toHaveLength(1);
  }); // todo split this into "shows empty comments list" and "shows existing comments"
  it('does not save empty comments', () => {
    const comments = shallow(<CommentPane onSave={onSave} onClose={onClose} />);
    comments
      .find('[data-testid="comment-save"]')
      .first()
      .simulate('click');
    expect(onSave).not.toHaveBeenCalled();
  });
  it('saves and shows a new comment', () => {
    const testComment = 'test comment';
    const comments = shallow(<CommentPane onSave={onSave} onClose={onClose} />);
    comments
      .find('[data-testid="comment-input"]')
      .first()
      .simulate('change', { target: { value: testComment } });
    comments
      .find('[data-testid="comment-save"]')
      .first()
      .simulate('click');
    expect(onSave).toHaveBeenCalledWith(testComment);
  });
  it('calls closehandler when closed', () => {
    const comments = shallow(<CommentPane onSave={onSave} onClose={onClose} />);
    comments.find('[data-testid="comment-close"]').simulate('click');
    expect(onClose).toHaveBeenCalled();
  });
});
