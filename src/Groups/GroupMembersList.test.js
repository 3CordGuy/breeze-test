import React from "react";
import { shallow, mount } from "enzyme";
import GroupMembersList from "./GroupMembersList";
import API from "../API";
import _ from "lodash";

let MEMBERS_RESPONSE = {
    data: {
        id: 62,
        name: "Pawnee Book Club",
        created_at: "2020-06-28T01:17:03.000000Z",
        updated_at: "2020-06-28T01:17:03.000000Z",
        members: [
            {
                id: 128,
                first_name: "Leslie",
                last_name: "Knope",
                email_address: "leslise@pawnee.in.gov",
                status: "active",
                created_at: "2020-06-28T15:12:07.000000Z",
                group: {
                    id: 62,
                    name: "Pawnee Book Club",
                    created_at: "2020-06-28T01:17:03.000000Z",
                    updated_at: "2020-06-28T01:17:03.000000Z",
                },
                updated_at: "2020-06-28T15:12:07.000000Z",
            },
            {
                id: 132,
                first_name: "Wilma",
                last_name: "Flintstone",
                email_address: "wilmaflinstone@example.com",
                status: "active",
                created_at: "2020-06-28T15:12:07.000000Z",
                group: {
                    id: 62,
                    name: "Pawnee Book Club",
                    created_at: "2020-06-28T01:17:03.000000Z",
                    updated_at: "2020-06-28T01:17:03.000000Z",
                },
                updated_at: "2020-06-28T15:12:07.000000Z",
            },
        ],
    },
};

let wrapper, data;

// SNAPSHOT TEST
describe("<GroupMembersList />", () => {
    beforeAll(() => {
        wrapper = shallow(<GroupMembersList />);

        data = [
            {
                id: 132,
                name: "Awesome Group",
                members: [
                    {
                        id: 132,
                        first_name: "Macie",
                        last_name: "Emmerich",
                        email_address: "cremin.marjory@hotmail.com",
                        status: "active",
                        updated_at: "2019-07-20 22:05:47",
                        created_at: "2019-07-20 22:05:47",
                    },
                ],
                updated_at: "2019-07-20 22:05:47",
                created_at: "2019-07-20 22:05:47",
            },
        ];

        wrapper.setState({ group: data[0].name, members: data[0].members });
    });

    test("should match the snapshot", () => {
        expect(wrapper).toMatchSnapshot();
    });
});

// // UNIT TESTS
describe("<GroupMembersList />", () => {
    it("should show a proper loader", () => {
        const wrapper = mount(<GroupMembersList />);

        wrapper.setState({ loading: true });

        let loader = wrapper.find("div.loader");

        expect(loader.text()).toBe("Loading Data...");
    });

    it("should fetch the groups async", () => {
        const promise = new Promise((resolve) => resolve(MEMBERS_RESPONSE));

        API.getGroup = jest.fn(() => promise);

        const wrapper = mount(<GroupMembersList />);

        expect(wrapper.find("table tbody tr").length).toEqual(1);

        promise.then(() => {
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find("table tbody tr").length).toEqual(2);

                API.getGroup.mockClear();
            });
        });
    });
});

// INTEGRATION

describe("<GroupMembersList />", () => {
    it("should sort list by group name", () => {
        const wrapper = mount(<GroupMembersList />);

        wrapper.setState({
            direction: "asc",
            data: _.orderBy(MEMBERS_RESPONSE.data, "name", ["asc"]),
        });

        let nameHeader = wrapper.find("th.ascending.sorted");

        nameHeader.simulate("click");
        wrapper.update();

        expect(wrapper.state().data).toEqual(
            _.orderBy(MEMBERS_RESPONSE.data, "name", ["desc"]),
        );

        nameHeader.simulate("click");

        expect(wrapper.state().data).toEqual(
            _.orderBy(wrapper.state().data, "name", ["asc"]),
        );
    });

    it("should warn when trying to remove a person", () => {
        const wrapper = mount(<GroupMembersList />);
        window.confirm = jest.fn();

        wrapper.setState({
            members: [
                {
                    id: 132,
                    first_name: "Jim",
                    last_name: "Halpert",
                    email_address: "jim.halpert@dundermifflin.com",
                    status: "active",
                    updated_at: "2019-07-20 22:05:47",
                    created_at: "2019-07-20 22:05:47",
                },
            ],
        });

        let trashButton = wrapper.find("button.negative");
        trashButton.simulate("click");

        expect(window.confirm).toBeCalled();
    });

    it("should allow removal of a group member", async () => {
        const wrapper = mount(<GroupMembersList />);

        wrapper.setState({
            direction: "asc",
            data: _.orderBy(MEMBERS_RESPONSE.data, "name", ["asc"]),
        });

        const removePersonPromise = new Promise((resolve) => {
            let newMembersList = MEMBERS_RESPONSE.data;
            newMembersList.members = newMembersList.members.filter(
                (member) => member.id === 128,
            );
            return resolve(newMembersList);
        });

        API.removePerson = jest.fn(() => removePersonPromise);

        await removePersonPromise;

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find("table tbody tr").length).toEqual(1);

            API.removePerson.mockClear();
        });
    });
});
