import { makeStyles, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles({
  root: {
    width: 120,
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 10,
    // elevation level 2
    filter: `
      drop-shadow(0px 1px 5px rgba(0,0,0,0.2))
      drop-shadow(0px 2px 2px rgba(0,0,0,0.14))
      drop-shadow(0px 3px 1px rgba(0,0,0,0.12))
    `,
    '&:hover': {
      // elevation level 3
      filter: `
        drop-shadow(0px 1px 8px rgba(0,0,0,0.2))
        drop-shadow(0px 3px 4px rgba(0,0,0,0.14))
        drop-shadow(0px 3px 3px rgba(0,0,0,0.12))
      `,
    },
  },
  paperNotch: {
    background: '#ffffff',
    padding: '4px 0px 5px 12px',
    overflowX: 'hidden',
    color: 'rgba(0,0,0,0.70)',
    clipPath: `
      polygon(
        0 0,
        100% 0,
        100% 100%,
        15.46% 100%,
        0 60%
      )
    `,
    '&:hover': {
      color: 'black',
      cursor: 'pointer',
    },
  },
  menuIcon: {
    marginTop: 10,
    float: 'right',
  },
});

const MenuNotch = props => {
  const classes = useStyles();
  const { onClick } = props;

  return (
    <div
      className={classes.root}
      onClick={onClick}
      onKeyPress={onClick}
      role="button"
      tabIndex="0"
    >
      <div className={classes.paperNotch}>
        <Typography variant="h4" component="span">
          Tome
        </Typography>
        <MenuIcon className={classes.menuIcon} />
      </div>
    </div>
  );
};

MenuNotch.propTypes = {
  onClick: PropTypes.func,
};

export default MenuNotch;
