import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

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
  const { children } = props;
  return <p className={classes.text}>{children}</p>;
}

TextContent.propTypes = {
  children: PropTypes.string,
};

export default TextContent;
