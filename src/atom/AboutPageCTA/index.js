import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  ButtonBase,
  makeStyles,
  Paper,
  Typography,
  Avatar,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'center',
  },
  paper: {
    padding: theme.spacing(3, 2),
    width: '100%',
    opacity: 0.94,
    transition: 'opacity 0.2s',
    '&:hover': {
      opacity: 1,
      transition: 'opacity 0.2s',
    },
    '&:focus': {
      opacity: 1,
      transition: 'opacity 0.2s',
    },
  },
  avatar: {
    marginLeft: 4,
  },
  textContent: {
    textAlign: 'left',
  },
}));

const AboutPageCTA = props => {
  const classes = useStyles();

  const { className: injectedClass, onClick: injectedOnClick } = props;

  return (
    <div className={classes.root}>
      <ButtonBase
        className={injectedClass}
        onClick={injectedOnClick}
        focusRipple
      >
        <Paper className={classes.paper}>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <Avatar className={classes.avatar}>
                <HelpIcon />
              </Avatar>
            </Grid>
            <Grid item xs={10} className={classes.textContent}>
              <Typography variant="h5">What is Tome?</Typography>
              <Typography variant="body2">
                Try out a demo and learn more!
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </ButtonBase>
    </div>
  );
};

AboutPageCTA.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default AboutPageCTA;
