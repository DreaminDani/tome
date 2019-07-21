import Box from '@material-ui/core/Box';
import { Container, Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import MaterialLink from '../src/atom/Link';
import { getData } from '../src/api';

function Index(props) {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome
        </Typography>
        {props.user ? (
          <React.Fragment>
            <Button color="primary" href="/edit">
              Create New Artifact
            </Button>
            {props.list && (props.list.length > 0) && (
              <React.Fragment>
                <Typography variant="subtitle1">
                  Or have a look at your previous work...
                </Typography>
                {props.list.map(artifact => (
                    <Typography key={artifact.id}>
                      <MaterialLink href='/artifact/[slug]' as={`/artifact/${artifact.id}`}>
                        {artifact.name}
                      </MaterialLink>
                    </Typography>
                ))}
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography>
              You must be logged in to continue
            </Typography>
            <Button variant="contained" color="primary" href="/edit">
              Login
            </Button>
          </React.Fragment>
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

  return {}
}

Index.propTypes = {
  user: PropTypes.object,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    user_id: PropTypes.number,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    auth_metadata: PropTypes.object,
  }))
}

export default Index;