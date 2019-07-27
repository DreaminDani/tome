/* eslint-env jest */

import { shallow } from 'enzyme';
import ArtifactSetingsPane from '.';

describe('ArtifactSetingsPane', () => {
  it('discards the changes, on discard click', () => {
    const handleDiscard = jest.fn();

    const artifactSettingsPane = shallow(
      <ArtifactSetingsPane handleDiscard={handleDiscard} />
    );
    artifactSettingsPane.find({ children: 'Discard' }).simulate('click');
    expect(handleDiscard).toHaveBeenCalled();
  });

  it('saves the changes, on save click', () => {
    const handleSave = jest.fn();

    const artifactSettingsPane = shallow(
      <ArtifactSetingsPane handleSave={handleSave} />
    );
    artifactSettingsPane.find({ children: 'Save' }).simulate('click');
    expect(handleSave).toHaveBeenCalled();
  });

  it('should update css when passed a "focused" prop', () => {
    const artifactSettingsPane = shallow(<ArtifactSetingsPane focused />);
    expect(artifactSettingsPane.find('.keyboard-focused')).toHaveLength(1);
  });

  it('should have no css update when not passed a "focused" prop', () => {
    const artifactSettingsPane = shallow(<ArtifactSetingsPane />);
    expect(artifactSettingsPane.find('.keyboard-focused')).toHaveLength(0);
  });
});
