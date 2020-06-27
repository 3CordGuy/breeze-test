import React from "react";
import { shallow } from "enzyme";
import GroupMembersList from "./GroupMembersList";

let wrapper, data;

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
