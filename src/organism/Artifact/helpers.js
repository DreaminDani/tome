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

export const saveLocalComment = (
  updatedComments,
  comments,
  selection,
  comment,
  displayName,
  updateComments,
  setSelection
) => {
  const currentTime = new Date().getTime();
  const newComments =
    updatedComments.length > 0 ? [...updatedComments] : [...comments];
  if (selection.location.length > 0) {
    newComments.push({
      user: {
        id: 0,
        name: displayName,
      },
      comment,
      created: currentTime,
      updated: currentTime,
      location: selection.location,
      id: `${currentTime}`,
    });
  } else {
    newComments.push({
      user: {
        id: 0,
        name: displayName,
      },
      comment,
      created: currentTime,
      updated: currentTime,
      id: selection.selection,
    });
  }
  updateComments(newComments);
  updateFocusedComment(comment, newComments, setSelection);
};
