import React, { Component } from "react";
import { Table, Header, Button, Icon, Dimmer, Loader } from "semantic-ui-react";
import _ from "lodash";

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

    handleSort = (clickedColumn) => () => {
        const { column, members, direction } = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                members: _.sortBy(members, [clickedColumn]),
                direction: "ascending",
            });

            return;
        }

        this.setState({
            members: members.reverse(),
            direction: direction === "ascending" ? "descending" : "ascending",
        });
    };

    componentDidMount() {
        let { group_id } = this.props;

        fetch(`http://localhost:8000/api/groups/${group_id}`)
            .then((response) => response.json())
            .then(({ data }) => {
                this.setState({
                    loading: false,
                    members: _.sortBy(data.members, [
                        "last_name",
                        "descending",
                    ]),
                    group: data.name,
                });
            });
    }

    render() {
        let { column, direction, members, group, loading } = this.state;
        let goto = this.props.navigate;

        return (
            <>
                {loading && (
                    <Dimmer active inverted>
                        <Loader>Loading Data...</Loader>
                    </Dimmer>
                )}
                <Button onClick={() => goto("/groups")}>Back</Button>
                <Header as="h1">
                    {group} <Header.Subheader>Group Members</Header.Subheader>
                </Header>
                <Table celled padded sortable>
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
                                            <Button icon circular primary>
                                                <Icon name="edit" />
                                            </Button>
                                            <Button
                                                icon
                                                negative
                                                basic
                                                circular
                                            >
                                                <Icon name="trash" />
                                            </Button>
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
