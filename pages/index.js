import Box from '@material-ui/core/Box';
import { Container, Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { getData } from '../src/api';
import ArtifactList from '../src/organism/ArtifactList';

function Index(props) {
  const { user, list } = props;
  return (
    <Container maxWidth="sm">
      <Box my={4}>
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
            <Button variant="contained" color="primary" href="/edit">
              Login
            </Button>
          </>
        )}
      </Box>
    </Container>
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
