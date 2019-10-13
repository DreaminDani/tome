/* eslint-env jest */

import { shallow } from 'enzyme';
import ArtifactList from '.';

describe('ArtifactList displays ArtifactListItems', () => {
  it('displays nothing when the list is empty', () => {
    // Arrange
    const list = [];

    // Act
    const artifactList = shallow(<ArtifactList list={list} />);

    // Assert
    expect(
      artifactList.find('[data-testid="artifact-list-empty-state-text"]')
    ).toHaveLength(1);
  });

  it('displays a list when it contains artifacts', () => {
    // Arrange
    const list = [
      {
        id: 'abc',
        name: 'Test',
        user_id: 1,
        created_at: '2015-03-25T12:00:00Z',
        updated_at: '2015-03-25T12:00:00Z',
        auth_metadata: {},
      },
    ];
    // Act
    const artifactList = shallow(<ArtifactList list={list} />);

    // Assert
    expect(artifactList.find('ul').children()).toHaveLength(list.length);
  });
});
