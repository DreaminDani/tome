import { Grid, Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextContent from '../../atom/TextContent';
import CommentPane from '../../molecule/CommentPane';
import { postData } from '../../api';

const useStyles = makeStyles({
  root: {
    padding: '0 40px',
  },
});

// looks for word in anchorNode text and returns its start/end points
const getWordOffsetsFromCaret = (anchorNode, anchorOffset) => {
  const word = [0, 0];

  for (let i = 0; i < anchorNode.textContent.length + 1; i += 1) {
    if (
      /\s/.exec(anchorNode.textContent.charAt(i)) ||
      anchorNode.textContent.charAt(i) === ''
    ) {
      if (i < anchorOffset) {
        word[0] = i + 1;
      } else {
        word[1] = i;
        break;
      }
    }
  }

  return word;
};

function Artifact({ artifact_data, id }) {
  const classes = useStyles();
  const [selection, setSelection] = useState({
    selection: '',
    location: [],
  });
  const [updatedComments, updateComments] = useState([]);
  const { name, body, comments } = artifact_data;

  const mouseDownHandler = e => {
    e.stopPropagation();
    const domSelection = window.getSelection();
    domSelection.removeAllRanges();
  };

  const mouseUpHandler = e => {
    // todo respond to touch events
    e.stopPropagation();
    const domSelection = window.getSelection();
    if (domSelection.type === 'Range') {
      const part = domSelection.focusNode.textContent.slice(
        domSelection.anchorOffset,
        domSelection.focusOffset
      );
      setSelection({
        selection: part,
        location: [domSelection.anchorOffset, domSelection.focusOffset],
      });
    } else if (
      domSelection.type === 'Caret' &&
      domSelection.anchorNode.nodeName === '#text'
    ) {
      const range = document.createRange();
      const wordOffsets = getWordOffsetsFromCaret(
        domSelection.anchorNode,
        domSelection.anchorOffset
      );

      range.setStart(domSelection.anchorNode, wordOffsets[0]);
      range.setEnd(domSelection.anchorNode, wordOffsets[1]);

      domSelection.removeAllRanges();
      domSelection.addRange(range);

      setSelection({
        selection: domSelection.anchorNode.textContent.substring(
          wordOffsets[0],
          wordOffsets[1]
        ),
        location: wordOffsets,
      });
    } else {
      setSelection({
        selection: '',
        location: [],
      });
    }
  };

  const commentSaveHandler = async comment => {
    const res = await postData(`/api/artifact/comment/add`, {
      id,
      comment,
      location: selection.location,
    });
    updateComments(res);
  };

  const commentCloseHandler = () => {
    setSelection({
      selection: '',
      location: [],
    });
  };

  const commentList = updatedComments.length > 0 ? updatedComments : comments;

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={8}>
        <Typography variant="h4">{name}</Typography>
        <TextContent
          id="artifact-content"
          commentList={commentList}
          // todo onBlur-like behavior to highlight selected region during commenting
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
        >
          {body}
        </TextContent>
      </Grid>
      <Grid item xs={12} sm={3}>
        {selection && (
          <CommentPane
            commentList={commentList}
            onSave={commentSaveHandler}
            onClose={commentCloseHandler}
          />
        )}
      </Grid>
    </Grid>
  );
}

Artifact.propTypes = {
  id: PropTypes.string,
  artifact_data: PropTypes.shape({
    body: PropTypes.string,
    name: PropTypes.string,
    comments: CommentPane.propTypes.commentList,
  }),
};

export default Artifact;
