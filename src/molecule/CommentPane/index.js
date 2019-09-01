import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  makeStyles,
  TextField,
  Button,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CommentList from '../../atom/CommentList';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  closeIcon: {
    float: 'right',
    marginTop: -16,
  },
}));

function CommentPane(props) {
  const classes = useStyles();
  const { selection, commentList, onSave, onClose } = props;
  const [comment, setComment] = useState('');

  const selectionComments = commentList.filter(c => c.id === selection);

  const onSaveHandler = async () => {
    if (comment) {
      await onSave(comment);
      setComment('');
    }
  };

  const onChangeHandler = event => {
    setComment(event.target.value);
  };

  return (
    <Paper className={classes.root}>
      <IconButton
        className={classes.closeIcon}
        data-testid="comment-close"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      {selectionComments.length > 0 && (
        <CommentList items={selectionComments} data-testid="comment-list" />
      )}
      <TextField
        data-testid="comment-input"
        label="Comment"
        multiline
        value={comment}
        margin="normal"
        variant="outlined"
        onChange={onChangeHandler}
        fullWidth
      />
      <Button
        data-testid="comment-save"
        variant="contained"
        color="primary"
        onClick={onSaveHandler}
        fullWidth
      >
        Add Comment
      </Button>
    </Paper>
  );
}

CommentPane.defaultProps = {
  selection: '',
  commentList: [],
};

CommentPane.propTypes = {
  selection: PropTypes.string,
  commentList: CommentList.propTypes.items,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
};

export default CommentPane;
