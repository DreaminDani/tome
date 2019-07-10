/* eslint-env jest */

import React from 'react';
import { mount, simulate } from 'enzyme';
import { act } from 'react-test-renderer';
import Artifact from './';

describe('Artifact responds to mouse events', () => {
  const map = {};
  let currentSelection = "";

  beforeAll(() => {
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
  })

  beforeEach(() => {
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

  it('does not update the selection, if nothing is clicked', () => {
    const artifact = mount(<Artifact />);
    map.mouseup(new Event('mouseup'));
    expect(window.getSelection).toHaveBeenCalled();
    expect(document.createRange).not.toHaveBeenCalled();
    artifact.unmount();
  });

  it('selects the whole line, if Caret is clicked', () => {
    // setup
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

    const artifact = mount(<Artifact />);
    act(() => {
      map.mouseup(new Event('mouseup'));
    })

    // test
    expect(document.createRange).toHaveBeenCalled();

    // cleanup
    artifact.unmount();
  });
});