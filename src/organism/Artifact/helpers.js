// looks for word in anchorNode text and returns its start/end points
export const getWordOffsetsFromCaret = (anchorNode, anchorOffset) => {
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

export const getSelectionLocation = (body, content, start, end) => {
  const remains = body.split(content);
  return [remains[0].length + start, remains[0].length + end];
};

export const setRangeSelection = (body, domSelection, setSelection) => {
  const part = domSelection.focusNode.textContent.slice(
    domSelection.anchorOffset,
    domSelection.focusOffset
  );
  setSelection({
    selection: part,
    location: getSelectionLocation(
      body,
      domSelection.focusNode.textContent,
      domSelection.anchorOffset,
      domSelection.focusOffset
    ),
  });
};

export const setCaretSelection = (
  body,
  domSelection,
  commentList,
  setSelection
) => {
  const wordOffsets = getWordOffsetsFromCaret(
    domSelection.anchorNode,
    domSelection.anchorOffset
  );

  const wordLocation = getSelectionLocation(
    body,
    domSelection.anchorNode.textContent,
    ...wordOffsets
  );

  // check if selected word overlaps with existing comment location
  let isNew = true;
  commentList.forEach(comment => {
    if (
      comment.location[0] >= wordLocation[0] &&
      comment.location[1] <= wordLocation[1]
    ) {
      setSelection({ selection: comment.id, location: [] });
      isNew = false;
    }
  });

  if (isNew) {
    const range = document.createRange();
    range.setStart(domSelection.anchorNode, wordOffsets[0]);
    range.setEnd(domSelection.anchorNode, wordOffsets[1]);

    domSelection.removeAllRanges();
    domSelection.addRange(range);

    setSelection({
      selection: domSelection.anchorNode.textContent.substring(
        wordOffsets[0],
        wordOffsets[1]
      ),
      location: wordLocation,
    });
  }
};

export const updateFocusedComment = (
  currentComment,
  commentList,
  setSelection
) => {
  for (let i = commentList.length - 1; i > -1; i -= 1) {
    // expects a conflicting comment to not have the same text AND be later in the array
    // beware of bugs / race conditions here
    if (commentList[i].comment === currentComment) {
      setSelection({
        selection: commentList[i].id,
        location: [],
      });
    }
  }
};

export const getCurrentCommentList = (comments, updatedComments, selection) => {
  // update comment list as comments get posted and returned
  let commentList = [];
  if (comments || updatedComments.length > 0) {
    commentList =
      updatedComments.length > 0 ? [...updatedComments] : [...comments];
  }

  // update comment list with temp comment to denote current selection
  if (
    selection.selection &&
    selection.selection.length > 0 &&
    selection.location.length > 0
  ) {
    commentList.push({
      comment: 'text',
      id: 'current-comment',
      location: selection.location,
    });
  }

  return commentList;
};
