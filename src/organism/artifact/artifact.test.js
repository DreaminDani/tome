/* eslint-env jest */

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Artifact from './';

describe('Artifact responds to mouse events', () => {
  const map = {};
  
  let container;
  let currentSelection = "";

  beforeAll(() => {
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
  })

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    window.getSelection = jest.fn(() => {
      if (currentSelection) {
        return {
          type: "Range",
        }
      } else {
        return {
          type: "None",
        }
      }
    });

    document.createRange = jest.fn();
    
    // window.addRange = jest.fn((selection) => {
    //   currentSelection = selection;
    // });
  });


  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('does not update the selection, if nothing is clicked', () => {
    // Act
    act(() => {
      ReactDOM.render(<Artifact />, container);
    });

    map.mouseup(new Event('mouseup'));
    
     // Assert
    expect(window.getSelection).toHaveBeenCalled();
    expect(document.createRange).not.toHaveBeenCalled();
  });

  it('selects the whole line, if Caret is clicked', () => {
    // Arrange
    window.getSelection = jest.fn(() => {
      return {
        type: "Caret",
        anchorNode: {
          nodeName: '#text'
        },
        focusNode: {
          textContent: 'line'
        },
        removeAllRanges: jest.fn(),
        addRange: jest.fn((range) => {
          if (range) {
            currentSelection = "line";
          }
        })
      }
    });
    document.createRange = jest.fn(() => {
      return {
        selectNodeContents: jest.fn()
      }
    });

    // Act
    act(() => {
      ReactDOM.render(<Artifact />, container);
    });

    act(() => {
      map.mouseup(new Event('mouseup'));
    })

    // Assert
    expect(document.createRange).toHaveBeenCalled();
  });
});