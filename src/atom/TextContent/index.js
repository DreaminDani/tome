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
  const { children, onMouseDown, onMouseUp } = props;
  return (
    // todo make this accessible
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <p onMouseDown={onMouseDown} onMouseUp={onMouseUp} className={classes.text}>
      {children}
    </p>
  );
}

TextContent.propTypes = {
  children: PropTypes.string,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
};

export default TextContent;
