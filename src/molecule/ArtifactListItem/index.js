import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import Link from 'next/link';
import { getDisplayNameFromName } from '../../helpers';

const useStyles = makeStyles(theme => ({
  root: {
    listStyle: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  paper: {
    padding: theme.spacing(3, 2),
    marginBottom: theme.spacing(1),
  },
}));

function ArtifactListItem(props) {
  const classes = useStyles();

  // eslint-disable-next-line react/destructuring-assignment
  const { id, name, auth_metadata, created_at } = props.artifact;

  const createdDate = new Date(created_at);

  return (
    <li id={id} className={classes.root}>
      <Link href="/artifact/[slug]" as={`/artifact/${id}`}>
        <Paper className={classes.paper}>
          <Typography variant="h5" component="h3">
            {name}
          </Typography>
          <Typography component="p">
            <strong>Created by: </strong>
            {getDisplayNameFromName(auth_metadata.name)} on{' '}
            {createdDate.toLocaleDateString()} at{' '}
            {createdDate.toLocaleTimeString()}
          </Typography>
        </Paper>
      </Link>
    </li>
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
