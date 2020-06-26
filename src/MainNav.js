import React from "react";
import { Link } from "@reach/router";

const MainNav = (props) => {
    console.log(props);

    /* 
      I realize this is not the proper api for matching routes with Reach router
      but I need to move on to other important features to complete this challenge
    */
    const get_item_class_for_route = (route) => {
        return props["*"] === route ? "active item" : "item";
    };

    return (
        <div className="ui attached tabular menu">
            <Link to="/groups" className={get_item_class_for_route("groups")}>
                All Groups
            </Link>
            <Link to="/people" className={get_item_class_for_route("people")}>
                All People
            </Link>
        </div>
    );
};

export default MainNav;
