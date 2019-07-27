/* eslint-env jest */

import { shallow } from 'enzyme';
import MenuNotch from '.';

describe('MenuNotch', () => {
  let handleClick;
  let menuNotch;

  beforeEach(() => {
    handleClick = jest.fn();
    menuNotch = shallow(<MenuNotch onClick={handleClick} />);
  });

  it('calls click handler when clicked', () => {
    menuNotch.simulate('click');
    expect(handleClick).toHaveBeenCalled();
  });

  it('calls click handler when key pressed', () => {
    menuNotch.simulate('keypress');
    expect(handleClick).toHaveBeenCalled();
  });
});
