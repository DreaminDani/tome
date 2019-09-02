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
    '& mark': {
      background: theme.palette.secondary.light,
      color: 'white',
      cursor: 'pointer',
      '&:hover': {
        background: theme.palette.secondary.dark,
      },
    },
  },
}));

function TextContent(props) {
  const classes = useStyles();
  const { children, commentList, onMouseDown, onMouseUp } = props;

  const withComments = [];
  const textComments = commentList ? [...commentList] : [];
  if (textComments.length > 0) {
    // reorder comments based on location start position
    textComments.sort(function(a, b) {
      if (a.location && b.location) {
        return a.location[0] - b.location[0];
      }
      if (a.location) {
        return 1;
      }
      if (b.location) {
        return -1;
      }
    });

    // then add marks to locations
    const characters = children.split('');
    let i = 0;
    let offset = 0;
    textComments.map(comment => {
      if (comment.location) {
        while (i < comment.location[0]) {
          withComments[i + offset] = characters[i];
          i += 1;
        }

        withComments[i + offset] = `<mark id="${comment.id}">`;
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
