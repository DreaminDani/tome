import {
  Button,
  ButtonGroup,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  settings: {
    [theme.breakpoints.down('xs')]: {
      background: '#ffffff',
      zIndex: 5,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      bottom: 0,
      width: '100%',
      marginLeft: -8,
      '&.keyboard-focused': {
        display: 'none',
      },
    },
  },
  actions: {
    [theme.breakpoints.down('xs')]: {
      float: 'right',
    },
    marginTop: 24,
    marginBottom: 24,
  },
  button: {
    marginRight: 8,
  },
}));

function ArtifactSettingsPane(props) {
  const classes = useStyles();
  const { handleDiscard, handleSave, focused } = props;

  return (
    <Grid
      item
      xs={12}
      sm={4}
      className={`${classes.settings} ${focused ? 'keyboard-focused' : ''}`}
    >
      <div className={classes.actions}>
        <Button className={classes.button} onClick={handleDiscard}>
          Discard
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleSave}
          id="save-artifact"
        >
          Save
        </Button>
      </div>
      <Typography variant="h4" component="h2" gutterBottom>
        Font type
      </Typography>
      <ButtonGroup aria-label="Small outlined button group">
        <Button>Serif</Button>
        <Button>Sans</Button>
        <Button>Mono</Button>
      </ButtonGroup>
    </Grid>
  );
}

ArtifactSettingsPane.propTypes = {
  handleDiscard: PropTypes.func,
  handleSave: PropTypes.func,
  focused: PropTypes.bool,
};

export default ArtifactSettingsPane;
