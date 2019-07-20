/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import Artifact from './';

describe('Artifact responds to mouse events', () => {
  const map = {};
  let container;

  beforeAll(() => {
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
  })

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    window.getSelection = jest.fn(() => {
      return {
        type: "None",
        removeAllRanges: jest.fn(),
        addRange: jest.fn()
      }
    });

    document.createRange = jest.fn();
  });


  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('clears selection on mousedown, to prepare for next selection', () => {
    // Act
    const artifact = shallow(<Artifact />);
    artifact.simulate('mousedown', new Event('mousedown'));
    
     // Assert
    expect(window.getSelection).toHaveBeenCalled();

    const domSelection = window.getSelection.mock.results[0].value;
    expect(domSelection.removeAllRanges).not.toHaveBeenCalled();
  })

  it('does not update the selection, if nothing is clicked', () => {
    // Act
    const artifact = shallow(<Artifact />);
    artifact.simulate('mouseup', new Event('mouseup'));
    
     // Assert
    expect(window.getSelection).toHaveBeenCalled();

    const domSelection = window.getSelection.mock.results[0].value;
    expect(document.createRange).not.toHaveBeenCalled();
    expect(domSelection.removeAllRanges).not.toHaveBeenCalled();
    expect(domSelection.addRange).not.toHaveBeenCalled();
  });

  it('does not update the selection, if a Range is selected', () => {
    // Arrange
    window.getSelection = jest.fn(() => {
      return {
        type: "Range",
        anchorNode: {
          nodeName: '#text'
        },
        focusNode: {
          textContent: 'line'
        },
        removeAllRanges: jest.fn(),
        addRange: jest.fn()
      }
    });

    // Act
    const artifact = shallow(<Artifact />);
    artifact.simulate('mouseup', new Event('mouseup'));
  
    // Assert
    expect(window.getSelection).toHaveBeenCalled();

    const domSelection = window.getSelection.mock.results[0].value;
    expect(document.createRange).not.toHaveBeenCalled();
    expect(domSelection.removeAllRanges).not.toHaveBeenCalled();
    expect(domSelection.addRange).not.toHaveBeenCalled();
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
        addRange: jest.fn()
      }
    });
    document.createRange = jest.fn(() => {
      return {
        selectNodeContents: jest.fn()
      }
    });

    // Act
    const artifact = shallow(<Artifact />);
    artifact.simulate('mouseup', new Event('mouseup'));

    // Assert
    expect(document.createRange).toHaveBeenCalled();
  });
});