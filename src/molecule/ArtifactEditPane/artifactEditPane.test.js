/* eslint-env jest */

import { shallow } from 'enzyme';
import ArtifactEditPane from '.';

describe('ArtifactEditPane default text', () => {
  const fakeText = 'some text';
  const handleChange = jest.fn();

  it('renders existing text in the name, when passed', () => {
    const artifactEditPane = shallow(
      <ArtifactEditPane handleChange={handleChange} name={fakeText} />
    );
    expect(artifactEditPane.find('#outlined-name').prop('value')).toEqual(
      fakeText
    );
  });

  it('renders existing text in the body, when passed', () => {
    const artifactEditPane = shallow(
      <ArtifactEditPane handleChange={handleChange} body={fakeText} />
    );
    expect(artifactEditPane.find('#outlined-body').prop('value')).toEqual(
      fakeText
    );
  });
});

describe('ArtifactEditPane text changes', () => {
  let artifactEditPane;
  const handleChange = jest.fn();

  beforeEach(() => {
    artifactEditPane = shallow(
      <ArtifactEditPane handleChange={handleChange} />
    );
  });

  it('calls the change handler with "name" when the artifact name is changed', () => {
    artifactEditPane.find('#outlined-name').simulate('change');
    expect(handleChange).toHaveBeenCalledWith('name');
  });

  it('calls the change handler with "body" when the artifact body is changed', () => {
    artifactEditPane.find('#outlined-body').simulate('change');
    expect(handleChange).toHaveBeenCalledWith('body');
  });
});

describe('ArtifactEditPane handles focus events', () => {
  let handleFocus;
  let handleBlur;
  const handleChange = jest.fn();

  beforeEach(() => {
    handleFocus = jest.fn();
    handleBlur = jest.fn();
  });

  it('calls handleFocus when name is focused', () => {
    const artifactEditPane = shallow(
      <ArtifactEditPane handleChange={handleChange} handleFocus={handleFocus} />
    );

    artifactEditPane.find('#outlined-name').simulate('focus');
    expect(handleFocus).toHaveBeenCalled();
  });

  it('calls handleFocus when body is focused', () => {
    const artifactEditPane = shallow(
      <ArtifactEditPane handleChange={handleChange} handleFocus={handleFocus} />
    );

    artifactEditPane.find('#outlined-body').simulate('focus');
    expect(handleFocus).toHaveBeenCalled();
  });

  it('calls handleBlur when name is blurred', () => {
    const artifactEditPane = shallow(
      <ArtifactEditPane handleChange={handleChange} handleBlur={handleBlur} />
    );

    artifactEditPane.find('#outlined-name').simulate('blur');
    expect(handleBlur).toHaveBeenCalled();
  });

  it('calls handleBlur when body is blurred', () => {
    const artifactEditPane = shallow(
      <ArtifactEditPane handleChange={handleChange} handleBlur={handleBlur} />
    );

    artifactEditPane.find('#outlined-body').simulate('blur');
    expect(handleBlur).toHaveBeenCalled();
  });
});
