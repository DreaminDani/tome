/* eslint-env jest */

import { shallow } from 'enzyme';
import Menu from '.';

describe('Menu displays list of menu items', () => {
  let menu;
  beforeEach(() => {
    menu = shallow(<Menu />);
  });

  it('is closed before clicked', () => {
    expect(menu.childAt(1).prop('open')).toBeFalsy();
  });

  it('is open after clicked', () => {
    menu.childAt(0).simulate('click');
    expect(menu.childAt(1).prop('open')).toBeTruthy();
  });
});
