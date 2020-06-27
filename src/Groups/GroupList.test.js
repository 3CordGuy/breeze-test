import React from 'react';
import { shallow } from 'enzyme';
import GroupList from './GroupList';

let wrapper, data;

describe('<GroupList />', () => {

    beforeAll(() => {
        wrapper = shallow(<GroupList />)
        data = [{
            "id": 132,
            "name": "Awesome Group",
            "updated_at": "2019-07-20 22:05:47",
            "created_at": "2019-07-20 22:05:47"
        }]

        wrapper.setState({ 'data' : data });
    });

    test('should match the snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
})
