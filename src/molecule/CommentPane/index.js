import React, { useState, useContext } from 'react';
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
import { UserContext } from '../../contexts';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    maxWidth: 464,
  },
  closeIcon: {
    float: 'right',
    marginTop: -16,
  },
}));

function CommentPane(props) {
  const classes = useStyles();
  const user = useContext(UserContext) || {
    name: 'Your Name',
  };
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

  const getDisplayNameFromName = name => {
    if (typeof name === 'string') {
      return name;
    }

    if (typeof name === 'object' && name.given_name && name.family_name) {
      return `${name.given_name} ${name.family_name}`;
    }

    return 'A tome user';
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
      {selectionComments.length > 0 ? (
        <CommentList items={selectionComments} data-testid="comment-list" />
      ) : (
        getDisplayNameFromName(user.name)
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
        autoFocus
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
