import React from "react";
import ReactDOM from "react-dom";
import { Container, Header } from "semantic-ui-react";
import { Router } from "@reach/router";

import GroupList from "./Groups/GroupList";
import GroupMembersList from "./Groups/GroupMembersList";
import PeopleList from "./People/PeopleList";

const App = ({ children }) => (
    <Container style={{ margin: 20 }}>
        <Header as="h3">
            <span role="img" aria-label="logo">
                ⛵️
            </span>{" "}
            Breeze Church Management{" "}
        </Header>

        {children}
    </Container>
);

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
    "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);
document.head.appendChild(styleLink);

ReactDOM.render(
    <App>
        <Router>
            <GroupList path="/" />
            <PeopleList path="/people" />
            <GroupMembersList path="/group/:group_id" />
        </Router>
    </App>,
    document.getElementById("root"),
);
