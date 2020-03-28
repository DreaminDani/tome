import { Grid, Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts';
import TextContent from '../../atom/TextContent';
import CommentPane from '../../molecule/CommentPane';
import { commentProps } from '../../atom/CommentList';
import { postData } from '../../api';
import {
  setRangeSelection,
  updateFocusedComment,
  getCurrentCommentList,
  saveLocalComment,
} from './helpers';

const useStyles = makeStyles({
  root: {
    padding: '0 40px',
  },
});

function Artifact({ artifact_data, id, disableSave }) {
  const classes = useStyles();

  const user = useContext(UserContext) || {
    displayName: 'Your Name',
  };
  const [selection, setSelection] = useState({
    selection: '',
    location: [],
  });
  const [updatedComments, updateComments] = useState([]);
  const { name, body, comments } = artifact_data;

  const commentList = getCurrentCommentList(
    comments,
    updatedComments,
    selection
  );

  const mouseDownHandler = e => {
    e.stopPropagation();
    const domSelection = window.getSelection();
    domSelection.removeAllRanges();
  };

  const mouseUpHandler = e => {
    // todo respond to touch events
    const title = document.getElementById('artifact-title');
    const commentPane = document.getElementById('artifact-comment');
    if (
      !(title && title.contains(e.target)) &&
      !(commentPane && commentPane.contains(e.target))
    ) {
      e.stopPropagation();
      if (e.target.localName === 'mark') {
        setSelection({
          selection: e.target.id,
          location: [],
        });
      } else {
        const domSelection = window.getSelection();
        if (domSelection.type === 'Range') {
          setRangeSelection(body, domSelection, setSelection);
        } else {
          setSelection({
            selection: '',
            location: [],
          });
        }
      }
    }
  };

  const commentSaveHandler = async comment => {
    if (disableSave) {
      saveLocalComment(
        updatedComments,
        comments,
        selection,
        comment,
        user.displayName,
        updateComments,
        setSelection
      );
    } else {
      let res = [];
      if (selection.location.length > 0) {
        res = await postData(`/api/artifact/comment/add`, {
          id,
          comment,
          location: selection.location,
        });
      } else {
        res = await postData(`/api/artifact/comment/update`, {
          id,
          comment,
          commentID: selection.selection,
        });
      }

      updateComments(res.commentlist);
      updateFocusedComment(comment, res.commentlist, setSelection);
    }
  };

  const commentCloseHandler = () => {
    setSelection({
      selection: '',
      location: [],
    });
    const domSelection = window.getSelection();
    domSelection.removeAllRanges();
  };

  return (
    <Grid
      container
      className={classes.root}
      onMouseUp={mouseUpHandler}
      data-testid="artifact-grid"
    >
      <Grid item xs={12} sm={6} md={8}>
        <Typography variant="h4" id="artifact-title">
          {name}
        </Typography>
        <TextContent
          id="artifact-content"
          selection={selection.selection}
          commentList={commentList}
          onMouseDown={mouseDownHandler}
        >
          {body}
        </TextContent>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        {selection.selection && selection.selection.length > 0 && (
          <CommentPane
            id="artifact-comment"
            selection={selection.selection}
            commentList={commentList}
            onSave={commentSaveHandler}
            onClose={commentCloseHandler}
          />
        )}
      </Grid>
    </Grid>
  );
}

Artifact.defaultProps = {
  disableSave: false,
};

export const artifactDataProps = {
  body: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.string,
  comments: commentProps,
  version: PropTypes.number, // optional
};

Artifact.propTypes = {
  id: PropTypes.string,
  artifact_data: PropTypes.shape(artifactDataProps),
  disableSave: PropTypes.bool,
};

export default Artifact;
