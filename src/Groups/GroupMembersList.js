import React, { Component } from "react";
import { Table, Header, Button, Icon } from "semantic-ui-react";
import _ from "lodash";

class GroupMembersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            .then(({ data }) =>
                this.setState({
                    members: _.sortBy(data.members, [
                        "last_name",
                        "descending",
                    ]),
                    group: data.name,
                }),
            );
    }

    render() {
        let { column, direction, members, group } = this.state;

        return (
            <>
                <Header as="h1">{group}</Header>
                <Table celled padded sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell singleLine>
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
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {members.map((person, index) => {
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
                                    <Table.Cell singleLine textAlign="center">
                                        <Button icon circular primary>
                                            <Icon name="edit" />
                                        </Button>
                                        <Button icon negative basic circular>
                                            <Icon name="trash" />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </>
        );
    }
}

export default GroupMembersList;
