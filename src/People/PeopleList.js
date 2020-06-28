import React, { Component } from "react";
import {
    Table,
    Dimmer,
    Loader,
    Header,
    Icon,
    Button,
    Dropdown,
} from "semantic-ui-react";
import { Link, Location } from "@reach/router";
import API from "../API";
import ImportCSV from "../ImportCSV";
import _ from "lodash";

class PeopleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            column: "last_name",
            direction: "ascending",
            data: [],
            groups: [],
            loading: true,
        };
    }

    getPeople = () => {
        this.setState({ loading: true });
        API.getPeople().then(({ data }) =>
            this.setState({
                data: _.sortBy(data, ["last_name", "ascending"]),
                loading: false,
            }),
        );
    };

    getGroups = () => {
        this.setState({ loading: true });
        API.getGroups().then(({ data }) =>
            this.setState({
                groups: data.map((group) => ({
                    key: group.id,
                    value: group.id,
                    text: group.name,
                })),
                loading: false,
            }),
        );
    };

    componentDidMount() {
        this.getPeople();
        this.getGroups();
    }

    handleSort = (clicked_column) => () => {
        const { column, data, direction } = this.state;
        if (column !== clicked_column) {
            this.setState({
                column: clicked_column,
                data: _.sortBy(data, [clicked_column]),
                direction: "descending",
            });

            return;
        }

        this.setState({
            data: data.reverse(),
            direction: direction === "ascending" ? "descending" : "ascending",
        });
    };

    handleAssignGroup = (person, group_id) => {
        person.group_id = group_id;
        delete person.group;

        this.setState({ loading: true });
        API.updatePerson(person).then(() => this.getPeople());
    };

    handleRemove = (person) => {
        if (
            window.confirm(
                `Are you sure you want to delete ${person.first_name} ${person.last_name}?!`,
            )
        ) {
            this.setState({ loading: true });
            API.removePerson(person.id).then(() => this.getPeople());
        }
    };

    render() {
        let data = this.state.data || [];
        let { loading, groups, column, direction } = this.state;

        return (
            <>
                {loading && (
                    <Dimmer active inverted>
                        <Loader>Loading Data...</Loader>
                    </Dimmer>
                )}
                <Header as="h1" dividing>
                    <Icon name="user" />

                    <Header.Content as="div" style={{ width: "100%" }}>
                        People
                        <Location>
                            {({ location }) => (
                                <ImportCSV
                                    text="Upload CSV"
                                    location={location}
                                    onFinish={this.getPeople}
                                />
                            )}
                        </Location>
                    </Header.Content>
                </Header>

                <Table celled padded sortable basic="very">
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
                                sorted={
                                    column === "last_name" ? direction : null
                                }
                                onClick={this.handleSort("last_name")}
                            >
                                Last Name
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={
                                    column === "email_address"
                                        ? direction
                                        : null
                                }
                                onClick={this.handleSort("email_address")}
                            >
                                Email
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={
                                    column === "group.name" ? direction : null
                                }
                                onClick={this.handleSort("group.name")}
                            >
                                Group
                            </Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.length ? (
                            data.map((person, index) => {
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
                                            {person.group ? (
                                                <Link
                                                    to={`/groups/${person.group.id}`}
                                                >
                                                    {person.group.name}
                                                </Link>
                                            ) : (
                                                <Dropdown
                                                    selection
                                                    placeholder="Add to Group"
                                                    renderLabel={({ text }) =>
                                                        text
                                                    }
                                                    onChange={(e, data) =>
                                                        this.handleAssignGroup(
                                                            person,
                                                            data.value,
                                                        )
                                                    }
                                                    options={groups}
                                                ></Dropdown>
                                            )}
                                        </Table.Cell>

                                        <Table.Cell
                                            singleLine
                                            textAlign="center"
                                        >
                                            <Button
                                                icon
                                                circular
                                                negative
                                                basic
                                                onClick={() =>
                                                    this.handleRemove(person)
                                                }
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
                                    There are no People yet!{" "}
                                    <span
                                        role="img"
                                        aria-label="sad face"
                                        style={{ fontSize: "2rem" }}
                                    >
                                        🙁
                                    </span>
                                </Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </>
        );
    }
}

export default PeopleList;
