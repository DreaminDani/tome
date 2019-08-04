/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import Artifact from '.';

describe('Artifact responds to mouse events', () => {
  const map = {};
  let container;

  beforeAll(() => {
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    window.getSelection = jest.fn(() => ({
      type: 'None',
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    }));

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
    expect(domSelection.removeAllRanges).toHaveBeenCalled();
  });

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
    window.getSelection = jest.fn(() => ({
      type: 'Range',
      anchorNode: {
        nodeName: '#text',
      },
      focusNode: {
        textContent: 'line',
      },
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    }));

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

  it('selects an entire word, if Caret is clicked', () => {
    // Arrange
    const anchorNode = {
      nodeName: '#text',
      textContent: 'line with words',
    };
    window.getSelection = jest.fn(() => ({
      type: 'Caret',
      anchorNode,
      anchorOffset: 7,
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    }));

    const range = {
      selectNodeContents: jest.fn(),
      setStart: jest.fn(),
      setEnd: jest.fn(),
    };
    document.createRange = jest.fn(() => range);

    // Act
    const artifact = shallow(<Artifact />);
    artifact.simulate('mouseup', new Event('mouseup'));

    // Assert
    expect(document.createRange).toHaveBeenCalled();
    expect(range.setStart).toHaveBeenCalledWith(anchorNode, 5);
    expect(range.setEnd).toHaveBeenCalledWith(anchorNode, 9);
  });
});
