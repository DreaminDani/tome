import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@material-ui/core';
import TextContent from '../../atom/TextContent';

export default function Artifact() {
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
  }

  const mouseDownHandler = e => {
    e.stopPropagation();
    const domSelection = window.getSelection();
    domSelection.removeAllRanges();
  }

  useEffect(() => {
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("mousedown", mouseDownHandler);
    return () => {
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [mouseDownHandler, mouseUpHandler]);

  return (
    <Container id="artifact" maxWidth="sm">
      <Box my={4}>
          <Typography>
          Currently selected:<br/>
          {selection}
          <br/>
          <br/>
          </Typography>
          <TextContent />
      </Box>
    </Container>
  )
}