import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '../src/Link';


export default function Index() {
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
      </Box>
    </Container>
  );
}
