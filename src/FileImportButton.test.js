import React from "react";
import { shallow } from "enzyme";
import FileImportButton from "./FileImportButton";

let wrapper;

describe("<FileImportButton />", () => {
    beforeAll(() => {
        wrapper = shallow(<FileImportButton />);

        wrapper.setProps({
            text: "It's dangerous to go alone... take this CSV file.",
        });
    });

    test("should match the snapshot", () => {
        expect(wrapper).toMatchSnapshot();
    });
});
