import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';

import { getData, postData } from '../src/api';
import ArtifactList from '../src/organism/ArtifactList';
import SignUp from '../src/molecule/SignUp';
import Login from '../src/molecule/Login';

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
  const classes = useStyles();
  const { user, list } = props;

  const [onLogin, setOnLogin] = useState(false);

  const localLogin = async (email, password) => {
    const res = await postData('/login', { email, password });
    console.log(res); // todo handle error
    // todo redirect/update user on success
  };

  const localSignup = async (firstName, lastName, email, password) => {
    const res = await postData('/signup', {
      firstName,
      lastName,
      email,
      password,
    });
    console.log(res); // todo handle error
    // todo redirect/update user on success
  };

  const getPageContent = () => {
    if (user) {
      return (
        <>
          <Button color="primary" href="/edit">
            Create New Artifact
          </Button>
          <ArtifactList list={list} />
        </>
      );
    }
    if (onLogin) {
      return (
        <Login onSubmit={localLogin} toggleLogin={() => setOnLogin(false)} />
      );
    }

    return (
      <SignUp onSubmit={localSignup} toggleLogin={() => setOnLogin(true)} />
    );
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} md={6} className={classes.hero} />
      <Grid item xs={12} md={6} className={classes.content}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome
        </Typography>
        {getPageContent()}
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
