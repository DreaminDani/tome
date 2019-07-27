/* eslint-env jest */

import { shallow } from 'enzyme';
import ArtifactListItem from '.';

describe('ArtifactListItem', () => {
  const fakeArtifact = {
    id: 'abc',
    name: 'Test',
    user_id: 1,
    created_at: '2015-03-25T12:00:00Z',
    updated_at: '2015-03-25T12:00:00Z',
    auth_metadata: {},
  };

  let artifactListItem;
  beforeEach(() => {
    artifactListItem = shallow(<ArtifactListItem artifact={fakeArtifact} />);
  });

  it("should display the artifact's name", () => {
    expect(artifactListItem.find({ component: 'h3' }).prop('children')).toEqual(
      fakeArtifact.name
    );
  });

  it('should display details about the artifact', () => {
    expect(
      artifactListItem.find({ component: 'p' }).prop('children')
    ).toMatchSnapshot();
  });
});
