import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import Link from '../../atom/Link';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function ArtifactListItem(props) {
  const classes = useStyles();

  // eslint-disable-next-line react/destructuring-assignment
  const { id, name, auth_metadata, created_at } = props.artifact;

  const createdDate = new Date(created_at);

  return (
    <Link href="/artifact/[slug]" as={`/artifact/${id}`}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          {name}
        </Typography>
        <Typography component="p">
          <strong>Created by: </strong>
          {auth_metadata.name ? auth_metadata.name : 'A tome user'} on{' '}
          {createdDate.toLocaleDateString()} at{' '}
          {createdDate.toLocaleTimeString()}
        </Typography>
      </Paper>
    </Link>
  );
}

ArtifactListItem.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    user_id: PropTypes.number,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    auth_metadata: PropTypes.object,
  }),
};

export default ArtifactListItem;
