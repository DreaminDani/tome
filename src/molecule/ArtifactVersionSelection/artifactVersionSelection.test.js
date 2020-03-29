/* eslint-env jest */

import { mount } from 'enzyme';
import ArtifactContext from '../../ArtifactContext';
import ArtifactVersionSelection from '.';

const testValue = {
  versions: [
    {
      version: 1,
      date: '2018-02-13T12:36:00Z',
    },
    {
      version: 2,
      date: '2019-02-13T12:36:00Z',
    },
  ],
  currentVersionIndex: 1,
  updateArtifactIndex: () => {},
};

describe('ArtifactVersionSelection', () => {
  it('renders all available versions with the current version selected', () => {
    const artifactVersionSelection = mount(
      <ArtifactContext.Provider value={testValue}>
        <ArtifactVersionSelection />
      </ArtifactContext.Provider>
    );

    expect(artifactVersionSelection.find('.MuiSlider-markLabel')).toHaveLength(
      2
    );
    expect(artifactVersionSelection.find('input').props().value).toBe('1');
    artifactVersionSelection.unmount();
  });

  it('updates the current version', () => {
    const updateCurrentVersionIndex = jest.fn();
    const localValue = { ...testValue, updateCurrentVersionIndex };
    const artifactVersionSelection = mount(
      <ArtifactContext.Provider value={localValue}>
        <ArtifactVersionSelection />
      </ArtifactContext.Provider>
    );

    // todo figure out how to change the value in enzyme
    // artifactVersionSelection
    //   .find('[data-testid="artifact-version"]')
    //   .first()
    //   .simulate('change', { target: { value: '0' } });
    // expect(updateCurrentVersionIndex).toBeCalledWith(1);
    artifactVersionSelection.unmount();
  });
});
