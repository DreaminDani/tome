import { Box, Container, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextContent from '../../atom/TextContent';

// looks for word in anchorNode text and returns its start/end points
const getWordOffsetsFromCaret = (anchorNode, anchorOffset) => {
  const word = [0, 0];

  for (let i = 0; i < anchorNode.textContent.length + 1; i += 1) {
    if (
      /\s/.exec(anchorNode.textContent.charAt(i)) ||
      anchorNode.textContent.charAt(i) === ''
    ) {
      if (i < anchorOffset) {
        word[0] = i + 1;
      } else {
        word[1] = i;
        break;
      }
    }
  }

  return word;
};

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
      const wordOffsets = getWordOffsetsFromCaret(
        domSelection.anchorNode,
        domSelection.anchorOffset
      );

      range.setStart(domSelection.anchorNode, wordOffsets[0]);
      range.setEnd(domSelection.anchorNode, wordOffsets[1]);

      domSelection.removeAllRanges();
      domSelection.addRange(range);

      setSelection(
        domSelection.anchorNode.textContent.substring(
          wordOffsets[0],
          wordOffsets[1]
        )
      );
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
