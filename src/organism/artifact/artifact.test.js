/* eslint-env jest */

import React from 'react';
import renderer from 'react-test-renderer';

import Artifact from './';

describe('With Snapshot Testing', () => {
  it('shows content', () => {
    const component = renderer.create(<Artifact />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})