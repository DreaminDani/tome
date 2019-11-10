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
    const artifact = shallow(<Artifact artifact_data={{}} />);
    artifact
      .find('#artifact-content')
      .first()
      .simulate('mousedown', new Event('mousedown'));

    // Assert
    expect(window.getSelection).toHaveBeenCalled();

    const domSelection = window.getSelection.mock.results[0].value;
    expect(domSelection.removeAllRanges).toHaveBeenCalled();
  });

  it('does not update the selection, if nothing is clicked', () => {
    // Act
    const artifact = shallow(<Artifact artifact_data={{}} />);
    artifact.find('[data-testid="artifact-grid"]').simulate('mouseup', {
      target: { localName: 'text' },
      stopPropagation: () => {},
    });

    // Assert
    expect(window.getSelection).toHaveBeenCalled();

    const domSelection = window.getSelection.mock.results[0].value;
    expect(document.createRange).not.toHaveBeenCalled();
    expect(domSelection.removeAllRanges).not.toHaveBeenCalled();
    expect(domSelection.addRange).not.toHaveBeenCalled();
  });

  it('does not modify the selection, if a Range is selected', () => {
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
    const artifact = shallow(
      <Artifact artifact_data={{ body: 'line with words' }} />
    );
    artifact.find('[data-testid="artifact-grid"]').simulate('mouseup', {
      target: { localName: 'text' },
      stopPropagation: () => {},
    });

    // Assert
    expect(window.getSelection).toHaveBeenCalled();

    const domSelection = window.getSelection.mock.results[0].value;
    expect(document.createRange).not.toHaveBeenCalled();
    expect(domSelection.removeAllRanges).not.toHaveBeenCalled();
    expect(domSelection.addRange).not.toHaveBeenCalled();
  });

  it('does nothing with the DOM selection, if a mark is clicked', () => {
    // Act
    const artifact = shallow(
      <Artifact
        artifact_data={{
          body: 'line <mark id="existing-comment">with</mark> words',
        }}
      />
    );
    artifact.find('[data-testid="artifact-grid"]').simulate('mouseup', {
      target: { localName: 'mark', id: 'existing-comment' },
      stopPropagation: () => {},
    });

    // Assert
    expect(window.getSelection).not.toHaveBeenCalled();
  });

  it('does nothing with the DOM selection, if the title is clicked', () => {
    // Arrange
    const artifact = shallow(
      <Artifact
        artifact_data={{
          body: 'line with words',
        }}
      />
    );

    // Act
    artifact.find('#artifact-title').simulate('mouseup', {
      target: { localName: 'text', id: 'artifact-title' },
      stopPropagation: () => {},
    });

    // Assert
    expect(window.getSelection).not.toHaveBeenCalled();
  });

  it('does nothing with the DOM selection and does not close the comment pane, if the comment pane is open and clicked', () => {
    // Arrange (open comment pane)
    const artifact = shallow(
      <Artifact
        artifact_data={{
          body: 'line <mark id="existing-comment">with</mark> words',
        }}
      />
    );
    artifact.find('[data-testid="artifact-grid"]').simulate('mouseup', {
      target: { localName: 'mark', id: 'existing-comment' },
      stopPropagation: () => {},
    });

    // Act
    artifact.find('#artifact-comment').simulate('mouseup', {
      target: { localName: 'div', id: 'artifact-comment' },
      stopPropagation: () => {},
    });

    // Assert
    expect(window.getSelection).not.toHaveBeenCalled();
    expect(artifact.find('#artifact-comment')).toBeTruthy();
  });
});
