import React, { Component } from "react";
import { Table, Header, Button, Dimmer, Loader } from "semantic-ui-react";
import _ from "lodash";
import ImportCSV from "../ImportCSV";

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

    componentDidMount() {
        this.fetchGroupMembers();
    }

    fetchGroupMembers = () => {
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

                <ImportCSV
                    text="Import Members"
                    onFinishImport={this.fetchGroupMembers}
                />

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
                                            {/* <Button icon circular primary>
                                                <Icon name="edit" />
                                            </Button>
                                            <Button
                                                icon
                                                negative
                                                basic
                                                circular
                                            >
                                                <Icon name="trash" />
                                            </Button> */}
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
