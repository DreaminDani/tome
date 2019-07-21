import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import Link from '../src/atom/Link';
import { getData } from '../src/api';

function Index(props) {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome
        </Typography>
        {props.user ? (
          props.list &&
            props.list.map(artifact => (
                <Typography key={artifact.id}>
                  <Link href='/artifact/[slug]' as={`/artifact/${artifact.id}`}>
                    {artifact.name}
                  </Link>
                </Typography>
            ))
        ) : 'You must be logged in to continue'}
      </Box>
    </Container>
  );
}

Index.getInitialProps = async ({ req }) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const res = await getData(`/api/artifacts`, req.headers.cookie);
    console.log(res);
    return res;
  }

  return {}
}

Index.propTypes = {
  user: PropTypes.object,
  list: PropTypes.arrayOf({
    id: PropTypes.string,
    name: PropTypes.string,
    user_id: PropTypes.number,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    auth_metadata: PropTypes.object,
  })
}

export default Index;