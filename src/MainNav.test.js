import React from "react";
import { shallow } from "enzyme";
import MainNav from "./MainNav";

let wrapper;

describe("<MainNav />", () => {
    beforeAll(() => {
        wrapper = shallow(<MainNav />);

        wrapper.setProps({ "*": "" });
    });

    test("should match the snapshot", () => {
        expect(wrapper).toMatchSnapshot();
    });
});
