import React from 'react';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  text: {
    whiteSpace: 'pre-wrap',
  },
});

const CommentList = props => {
  const classes = useStyles();
  const { items } = props;
  return items.map(comment => (
    <div key={comment.id} data-testid="comment-list-item">
      <Typography variant="caption">{comment.user.name}</Typography>
      <Typography variant="body1" className={classes.text} gutterBottom>
        {comment.comment}
      </Typography>
    </div>
  ));
};

CommentList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      comment: PropTypes.string,
    })
  ),
};

export default CommentList;
