import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '../src/Link';
import TextContent from '../src/TextContent';


export default function Index() {
  const [selection, setSelection] = useState("");
  const mouseUpHandler = e => {
    e.stopPropagation();
    const domSelection = window.getSelection();
    if (domSelection.focusNode.data) {
      setSelection(domSelection.focusNode.data);
    }
    // setSelection(window.getSelection());
  }

  useEffect(() => {
    window.onmouseup = mouseUpHandler;
  })

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tome
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <Typography>
          Currently selected:<br/>
          {selection}
          <br/>
          <br/>
        </Typography>
        <TextContent />
      </Box>
    </Container>
  );
}
