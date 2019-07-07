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
    if (domSelection.type === "Range") {
      const part = domSelection.focusNode.textContent.slice(
        domSelection.anchorOffset,
        domSelection.focusOffset
      )
      setSelection(part);
    } else if (domSelection.type === "Caret" && domSelection.anchorNode.nodeName === "#text") {
      const range = document.createRange();
      range.selectNodeContents(domSelection.anchorNode); // todo only select the word that was clicked
      domSelection.removeAllRanges();
      domSelection.addRange(range);
      setSelection(domSelection.focusNode.textContent);
    } else {
      setSelection("");
    }
    // setSelection(window.getSelection());
  }

  const mouseDownHandler = e => {
    e.stopPropagation();
    const domSelection = window.getSelection();
    domSelection.removeAllRanges();
  }

  useEffect(() => {
    window.onmousedown = mouseDownHandler;
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
