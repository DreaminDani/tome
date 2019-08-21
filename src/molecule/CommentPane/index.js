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

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function CommentPane(props) {
  const classes = useStyles();
  const { onSave, onClose } = props;
  const [comment, setComment] = useState('');

  const onSaveHandler = () => {
    // todo actually submit to backend in parent onSave
    console.log(comment);
    if (comment) {
      onSave(comment);
    }
  };

  const onChangeHandler = event => {
    setComment(event.target.value);
  };

  return (
    <Paper className={classes.root}>
      <TextField
        data-testid="comment-input"
        label="Comment"
        multiline
        // className={classes.textField}
        margin="normal"
        variant="outlined"
        onChange={onChangeHandler}
      />
      <Button
        data-testid="comment-save"
        variant="contained"
        color="primary"
        // className={classes.button}
        onClick={onSaveHandler}
      >
        Add Comment
      </Button>
      <IconButton
        className={classes.menuIcon}
        data-testid="comment-close"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Paper>
  );
}

CommentPane.propTypes = {
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  // todo add comment list for existing comments
};

export default CommentPane;
