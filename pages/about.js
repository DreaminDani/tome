import Head from 'next/head';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React from 'react';

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}

export default function AboutPage() {
  return (
    <div>
      <Head>
        <title>Tome - About</title>
      </Head>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            There will be more coming soon
          </Typography>
          <Link href="/">Go to the main page</Link>
          <MadeWithLove />
        </Box>
      </Container>
    </div>
  );
}
