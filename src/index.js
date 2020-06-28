import React from "react";
import ReactDOM from "react-dom";
import { Container, Header, Segment, Menu } from "semantic-ui-react";
import { Router, Redirect } from "@reach/router";

import GroupList from "./Groups/GroupList";
import GroupMembersList from "./Groups/GroupMembersList";
import PeopleList from "./People/PeopleList";
import MainNav from "./MainNav";

const App = (props) => {
    return (
        <Container style={{ margin: 20 }}>
            <Menu borderless>
                <Menu.Item header>
                    <span role="img" aria-label="logo">
                        ⛵️
                    </span>{" "}
                    Breeze Church Management
                </Menu.Item>
                <Menu.Item></Menu.Item>
            </Menu>
            <Header as="h3"></Header>
            <MainNav {...props} />
            <Segment attached="bottom">{props.children}</Segment>
        </Container>
    );
};

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
    "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);
document.head.appendChild(styleLink);

ReactDOM.render(
    <Router>
        <App path="/">
            <Redirect from="/" to="/groups" noThrow />
            <GroupList path="/groups" />
            <PeopleList path="/people" />
            <GroupMembersList path="/groups/:group_id" />
        </App>
    </Router>,
    document.getElementById("root"),
);
