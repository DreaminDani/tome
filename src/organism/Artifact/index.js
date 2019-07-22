import { Box, Container, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextContent from '../../atom/TextContent';

function Artifact(props) {
  const [selection, setSelection] = useState('');
  const { name, body } = props;

  const mouseDownHandler = e => {
    e.stopPropagation();
    const domSelection = window.getSelection();
    domSelection.removeAllRanges();
  };

  const mouseUpHandler = e => {
    // todo respond to touch events
    e.stopPropagation();
    const domSelection = window.getSelection();
    if (domSelection.type === 'Range') {
      const part = domSelection.focusNode.textContent.slice(
        domSelection.anchorOffset,
        domSelection.focusOffset
      );
      setSelection(part);
    } else if (
      domSelection.type === 'Caret' &&
      domSelection.anchorNode.nodeName === '#text'
    ) {
      const range = document.createRange();
      range.selectNodeContents(domSelection.anchorNode); // todo only select the word that was clicked
      domSelection.removeAllRanges();
      domSelection.addRange(range);
      setSelection(domSelection.focusNode.textContent);
    } else {
      setSelection('');
    }
  };

  console.log(selection); // todo pass this to the commenting tool

  return (
    <Container
      id="artifact"
      maxWidth="sm"
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
    >
      <Box my={4}>
        <Typography>{name}</Typography>
        <TextContent>{body}</TextContent>
      </Box>
    </Container>
  );
}

Artifact.propTypes = {
  name: PropTypes.string,
  body: PropTypes.string,
};

export default Artifact;
