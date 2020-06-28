import React from "react";
import { shallow, mount } from "enzyme";
import GroupList from "./GroupList";
import API from "../API";
import _ from "lodash";

const GROUP_LIST = {
    data: [
        {
            id: 62,
            name: "Pawnee Book Club",
            created_at: "2020-06-28T01:17:03.000000Z",
            updated_at: "2020-06-28T01:17:03.000000Z",
        },
        {
            id: 63,
            name: "Dunder Mifflin Fan Club",
            created_at: "2020-06-28T01:17:03.000000Z",
            updated_at: "2020-06-28T01:17:03.000000Z",
        },
    ],
    total: 2,
};

let wrapper, data;

// SNAPSHOT TEST
describe("<GroupList />", () => {
    beforeAll(() => {
        wrapper = shallow(<GroupList />);
        data = [
            {
                id: 132,
                name: "Awesome Group",
                updated_at: "2019-07-20 22:05:47",
                created_at: "2019-07-20 22:05:47",
            },
        ];

        wrapper.setState({ data: data });
    });

    test("should match the snapshot", () => {
        expect(wrapper).toMatchSnapshot();
    });
});

// // UNIT TESTS
describe("<GroupList />", () => {
    it("should show a proper loader", () => {
        const wrapper = mount(<GroupList />);
        wrapper.setState({ loading: true });

        let loader = wrapper.find("div.loader");

        expect(loader.text()).toBe("Loading Data...");
    });

    it("should fetch the groups async", () => {
        const promise = new Promise((resolve) => resolve(GROUP_LIST));

        API.getGroups = jest.fn(() => promise);

        const wrapper = mount(<GroupList />);

        expect(wrapper.find("table tbody tr").length).toEqual(1);

        promise.then(() => {
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find("table tbody tr").length).toEqual(2);

                API.getGroups.mockClear();
            });
        });
    });

    it("should sort list by group name", () => {
        const wrapper = mount(<GroupList />);
        wrapper.setState({
            direction: "asc",
            data: _.orderBy(GROUP_LIST.data, "name", ["asc"]),
        });

        let nameHeader = wrapper.find("th.ascending.sorted");

        nameHeader.simulate("click");
        wrapper.update();

        expect(wrapper.state().data).toEqual(
            _.orderBy(GROUP_LIST.data, "name", ["desc"]),
        );

        nameHeader.simulate("click");

        expect(wrapper.state().data).toEqual(
            _.orderBy(wrapper.state().data, "name", ["asc"]),
        );
    });
});
