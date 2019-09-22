import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import ArtifactListItem from '../../molecule/ArtifactListItem';

const useStyles = makeStyles({
  listRoot: {
    padding: 0,
  },
});

function ArtifactList(props) {
  const classes = useStyles();

  const { list } = props;

  if (list && list.length) {
    return (
      <>
        <Typography variant="subtitle1">
          Or have a look at your previous work...
        </Typography>
        <ul className={classes.listRoot}>
          {list.map(artifact => (
            <ArtifactListItem artifact={artifact} key={artifact.id} />
          ))}
        </ul>
      </>
    );
  }

  return null;
}

ArtifactList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      user_id: PropTypes.number,
      created_at: PropTypes.string,
      updated_at: PropTypes.string,
      auth_metadata: PropTypes.object,
    })
  ),
};

export default ArtifactList;
