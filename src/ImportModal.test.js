import React from "react";
import { shallow } from "enzyme";
import ImportModal from "./ImportModal";

let wrapper;

describe("<ImportModal />", () => {
    beforeAll(() => {
        wrapper = shallow(<ImportModal />);

        wrapper.setProps({ showModal: true });
    });

    test("should match the snapshot", () => {
        expect(wrapper).toMatchSnapshot();
    });
});
