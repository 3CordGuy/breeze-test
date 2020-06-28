import React from "react";
import { shallow, mount } from "enzyme";
import PeopleList from "./PeopleList";
// import ReactTestUtils from "react-dom/test-utils";
import API from "../API";

let PEOPLE_LIST_RESPONSE = {
    data: [
        {
            id: 123,
            first_name: "Leslie",
            last_name: "Knope",
            email_address: "leslise@pawnee.in.gov",
            status: "active",
            created_at: "2020-06-28T01:48:45.000000Z",
            group: {
                id: 63,
                name: "Dunder Mifflin Fan Club",
                created_at: "2020-06-28T01:17:03.000000Z",
                updated_at: "2020-06-28T01:17:03.000000Z",
            },
            updated_at: "2020-06-28T01:48:45.000000Z",
        },
        {
            id: 125,
            first_name: "Fred",
            last_name: "Flintstone",
            email_address: "fredflintstone@example.com",
            status: "active",
            created_at: "2020-06-28T01:48:45.000000Z",
            group: {
                id: 59,
                name: "Volunteers",
                created_at: "2020-06-28T01:17:03.000000Z",
                updated_at: "2020-06-28T01:17:03.000000Z",
            },
            updated_at: "2020-06-28T01:49:08.000000Z",
        },
        {
            id: 126,
            first_name: "Marie",
            last_name: "Bourne",
            email_address: "mbourne@example.com",
            status: "active",
            created_at: "2020-06-28T01:48:45.000000Z",
            group: {
                id: 63,
                name: "Dunder Mifflin Fan Club",
                created_at: "2020-06-28T01:17:03.000000Z",
                updated_at: "2020-06-28T01:17:03.000000Z",
            },
            updated_at: "2020-06-28T01:48:45.000000Z",
        },
        {
            id: 127,
            first_name: "Wilma",
            last_name: "Flintstone",
            email_address: "wilmaflinstone@example.com",
            status: "active",
            created_at: "2020-06-28T01:48:45.000000Z",
            group: {
                id: 61,
                name: "Bible Study",
                created_at: "2020-06-28T01:17:03.000000Z",
                updated_at: "2020-06-28T01:17:03.000000Z",
            },
            updated_at: "2020-06-28T01:49:11.000000Z",
        },
    ],
    total: 4,
};
let wrapper, data;

// SNAPSHOT
describe("<PeopleList />", () => {
    beforeAll(() => {
        wrapper = shallow(<PeopleList />);
        data = [
            {
                id: 132,
                first_name: "Macie",
                last_name: "Emmerich",
                email_address: "cremin.marjory@hotmail.com",
                status: "active",
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

// UNIT TESTS
describe("<PeopleList />", () => {
    beforeAll(() => {
        wrapper = shallow(<PeopleList />);
        wrapper.setState({ loading: false });
    });

    it.skip("should show a loader", () => {
        const wrapper = mount(<PeopleList />);
        expect(wrapper.someWhere()).toEqual(1);
    });

    it("should fetch the people async", () => {
        const promise = new Promise((resolve, reject) =>
            resolve(PEOPLE_LIST_RESPONSE),
        );

        API.getPeople = jest.fn(() => promise);

        const wrapper = mount(<PeopleList />);

        expect(wrapper.find("table tbody").length).toEqual(1);

        promise.then(() => {
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find("table tbody").length).toEqual(2);

                API.getPeople.mockClear();
            });
        });
    });
});
