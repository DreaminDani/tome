import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import Link from 'next/link';
import ArtifactListItem from '../../molecule/ArtifactListItem';

const useStyles = makeStyles(theme => ({
  listRoot: {
    padding: 0,
    maxWidth: 420,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
    },
  },
}));

function ArtifactList(props) {
  const classes = useStyles();

  const { list } = props;

  return (
    <>
      <Typography variant="h3" component="h1">
        My Artifacts
      </Typography>
      {list && list.length ? (
        <ul className={classes.listRoot}>
          {list.map(artifact => (
            <ArtifactListItem artifact={artifact} key={artifact.id} />
          ))}
        </ul>
      ) : (
        <Typography data-testid="artifact-list-empty-state-text">
          Use the button below to{' '}
          <Link href="/edit">
            <a>create a new artifact</a>
          </Link>
          .
        </Typography>
      )}
    </>
  );
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
