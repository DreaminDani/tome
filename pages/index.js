import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Fab, makeStyles, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useRouter } from 'next/router';

import { getData, postData } from '../src/api';
import ArtifactList from '../src/organism/ArtifactList';
import SignUp from '../src/molecule/SignUp';
import Login from '../src/molecule/Login';
import AboutPageCTA from '../src/atom/AboutPageCTA';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
  },
  hero: {
    background: "center / contain no-repeat url('/static/img/tome-hero.png')",
  },
  content: {
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      width: '100%',
    },
  },
  floatingButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  contentPaper: {
    maxWidth: 400,
    margin: '0 auto',
    padding: theme.spacing(3, 2),
    marginTop: theme.spacing(8),
    opacity: 0.94,
  },
  aboutPaper: {
    width: '100%',
    maxWidth: 400,
    marginTop: theme.spacing(2),
  },
}));

function Index(props) {
  const classes = useStyles();
  const { user, list } = props;

  const [onLogin, setOnLogin] = useState(false);
  const router = useRouter();

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
          {/* todo move this button out of the page content and into the bottom center of the screen */}
          <Fab
            className={classes.floatingButton}
            variant="extended"
            color="primary"
            href="/edit"
          >
            <AddIcon className={classes.extendedIcon} />
            Create New Artifact
          </Fab>
          <ArtifactList list={list} />
        </>
      );
    }
    if (onLogin) {
      return (
        <>
          <Paper className={classes.contentPaper}>
            <Login
              onSubmit={localLogin}
              toggleLogin={() => setOnLogin(false)}
            />
          </Paper>
          <AboutPageCTA
            className={classes.aboutPaper}
            onClick={() => router.push('/about')}
          />
        </>
      );
    }

    return (
      <>
        <Paper className={classes.contentPaper}>
          <SignUp onSubmit={localSignup} toggleLogin={() => setOnLogin(true)} />
        </Paper>
        <AboutPageCTA
          className={classes.aboutPaper}
          onClick={() => router.push('/about')}
        />
      </>
    );
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} md={6} className={classes.hero} />
      <Grid item xs={12} md={6} className={classes.content}>
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
