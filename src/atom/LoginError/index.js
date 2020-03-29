import React from 'react';
import PropTypes from 'prop-types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
    borderRadius: 4,
  },
}));

const LoginError = ({ className: inheritedClass, children }) => {
  const classes = useStyles();

  return (
    <div className={inheritedClass}>
      <Grid
        className={classes.background}
        spacing={2}
        container
        alignItems="center"
      >
        <Grid item>
          <ErrorIcon />
        </Grid>
        <Grid item>
          <Typography variant="body2">{children}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

LoginError.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string,
};

export default LoginError;
