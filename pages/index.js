import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { getData } from '../src/api';
import ArtifactList from '../src/organism/ArtifactList';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
  },
  hero: {
    background: "center / contain no-repeat url('/static/img/tome-hero.png')",
  },
  content: {
    marginTop: 40,
  },
});

function Index(props) {
  const { user, list } = props;

  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} md={6} className={classes.hero} />
      <Grid item xs={12} md={6} className={classes.content}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome
        </Typography>
        {user ? (
          <>
            <Button color="primary" href="/edit">
              Create New Artifact
            </Button>
            <ArtifactList list={list} />
          </>
        ) : (
          <>
            <Typography>You must be logged in to continue</Typography>
            <Button variant="contained" color="primary" href="/auth/google">
              <ExitToAppIcon />
              Login With Google
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
}

Index.getInitialProps = async ({ req }) => {
  if (req && req.session && req.session.passport && req.session.passport.user) {
    const res = await getData(`/api/artifacts`, req.headers.cookie);
    return res;
  }

  return {};
};

Index.propTypes = {
  user: PropTypes.object,
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

export default Index;
