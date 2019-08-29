/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-danger */
/* eslint-disable array-callback-return */
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import CommentList from '../CommentList';

const useStyles = makeStyles(theme => ({
  text: {
    fontFamily: `'Cormorant Garamond', serif`,
    whiteSpace: 'pre',
    '&::selection': {
      background: theme.palette.primary.light,
      color: 'white',
    },
  },
}));

function TextContent(props) {
  const classes = useStyles();
  const { children, commentList, onMouseDown, onMouseUp } = props;

  const withComments = [];
  if (commentList && commentList.length > 0) {
    const characters = children.split('');
    let i = 0;
    let offset = 0;
    commentList.map(comment => {
      if (comment.location) {
        while (i < comment.location[0]) {
          withComments[i + offset] = characters[i];
          i += 1;
        }

        withComments[i + offset] = '<mark>';
        offset += 1;

        while (i < comment.location[1]) {
          withComments[i + offset] = characters[i];
          i += 1;
        }
        withComments[i + offset] = '</mark>';
        offset += 1;
      }
    });

    while (i < characters.length) {
      withComments[i + offset] = characters[i];
      i += 1;
    }
  }

  return (
    // todo make this accessible
    <p
      dangerouslySetInnerHTML={{
        __html: withComments.length > 0 ? withComments.join('') : children,
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={classes.text}
    />
  );
}

TextContent.propTypes = {
  children: PropTypes.string,
  commentList: CommentList.propTypes.items,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
};

export default TextContent;
