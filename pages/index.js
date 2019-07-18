import React from 'react';
import fetch from "isomorphic-fetch";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '../src/Link';


function Index(props) {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tome
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <br/>
        <Link href="/artifact" color="primary">
          Go to an artifact page
        </Link>
        {props.thoughts &&
          props.thoughts.map(thought => (
              <Typography key={thought._id}>
                {thought.message} | {thought.author}
              </Typography>
          ))}
        {!props.thoughts && <Typography>Loading...</Typography>}
      </Box>
    </Container>
  );
}

Index.getInitialProps = async ({ req }) => {
  const baseURL = req ? `${req.protocol}://${req.get("Host")}` : "";
  const res = await fetch(`${baseURL}/api/thoughts`, {
    credentials: 'include'  
  });
  if (res.status === 200) {
    return {
      thoughts: await res.json()
    };
  } else {
    return {
      thoughts: ["error"]
    }
  }  
};

export default Index;