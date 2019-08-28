import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const CommentList = props => {
  const { items } = props;
  return items.map(comment => (
    <div key={comment.id} data-testid="comment-list-item">
      <Typography variant="caption">{comment.user}</Typography>
      <Typography variant="body1" gutterBottom>
        {comment.comment}
      </Typography>
    </div>
  ));
};

CommentList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      user: PropTypes.string,
      comment: PropTypes.string,
    })
  ),
};

export default CommentList;
