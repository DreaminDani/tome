import React from 'react';
import PropTypes from 'prop-types';
import { Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const CreateArtifactFab = ({ className: inheritedClass }) => {
  const classes = useStyles();
  return (
    <div className={inheritedClass}>
      <Fab id="create-artifact" variant="extended" color="primary" href="/edit">
        <AddIcon className={classes.extendedIcon} />
        Create New Artifact
      </Fab>
    </div>
  );
};

CreateArtifactFab.propTypes = {
  className: PropTypes.string,
};

export default CreateArtifactFab;
