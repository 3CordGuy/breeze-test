import React, { Component } from "react";
import {
    Table,
    Header,
    Button,
    Dimmer,
    Loader,
    Icon,
    Popup,
} from "semantic-ui-react";
import _ from "lodash";
import API from "../API";

class GroupMembersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            group: "Group",
            members: [],
            column: "last_name",
            direction: "descending",
        };
    }

    handleSort = (clicked_column) => () => {
        const { column, members, direction } = this.state;

        if (column !== clicked_column) {
            this.setState({
                column: clicked_column,
                members: _.sortBy(members, [clicked_column]),
                direction: "ascending",
            });

            return;
        }

        this.setState({
            members: members.reverse(),
            direction: direction === "ascending" ? "descending" : "ascending",
        });
    };

    handleRemove = (person) => {
        if (
            window.confirm(
                `Are you sure you want to remove ${person.first_name} ${person.last_name}?`,
            )
        ) {
            this.setState({ loading: true });
            person.group_id = null;
            delete person.group;

            API.updatePerson(person).then(() => this.getGroupMembers());
        }
    };

    componentDidMount() {
        this.getGroupMembers();
    }

    getGroupMembers = () => {
        let { group_id } = this.props;
        this.setState({ loading: true });

        API.getGroup(group_id).then(({ data }) => {
            this.setState({
                loading: false,
                members: _.sortBy(data.members, ["last_name", "descending"]),
                group: data.name,
            });
        });
    };

    render() {
        let { column, direction, members, group, loading } = this.state;

        return (
            <>
                {loading && (
                    <Dimmer active inverted>
                        <Loader>Loading Data...</Loader>
                    </Dimmer>
                )}
                <Header as="h1" dividing>
                    {group} <Header.Subheader>Group Members</Header.Subheader>
                </Header>

                <Button onClick={() => window.history.back()}>Back</Button>

                <Table celled padded basic="very" sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                singleLine
                                sorted={
                                    column === "first_name" ? direction : null
                                }
                                onClick={this.handleSort("first_name")}
                            >
                                First Name
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                singleLine
                                sorted={
                                    column === "last_name" ? direction : null
                                }
                                onClick={this.handleSort("last_name")}
                            >
                                Last Name
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === "email" ? direction : null}
                                onClick={this.handleSort("email")}
                            >
                                Email
                            </Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {members.length ? (
                            members.map((person, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell singleLine>
                                            {person.first_name}
                                        </Table.Cell>
                                        <Table.Cell singleLine>
                                            {person.last_name}
                                        </Table.Cell>
                                        <Table.Cell singleLine>
                                            {person.email_address}
                                        </Table.Cell>
                                        <Table.Cell singleLine>
                                            {person.status}
                                        </Table.Cell>
                                        <Table.Cell
                                            singleLine
                                            textAlign="center"
                                        >
                                            <Popup
                                                content="Remove from this group"
                                                trigger={
                                                    <Button
                                                        icon
                                                        circular
                                                        negative
                                                        basic
                                                        onClick={() =>
                                                            this.handleRemove(
                                                                person,
                                                            )
                                                        }
                                                    >
                                                        <Icon name="cancel" />
                                                    </Button>
                                                }
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })
                        ) : (
                            <Table.Row>
                                <Table.Cell textAlign="center">
                                    This Group has No Members{" "}
                                    <span
                                        role="img"
                                        aria-label="sad face"
                                        style={{ fontSize: "2rem" }}
                                    >
                                        🙁
                                    </span>
                                </Table.Cell>
                                <Table.Cell />
                                <Table.Cell />
                                <Table.Cell />
                                <Table.Cell />
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </>
        );
    }
}

export default GroupMembersList;
