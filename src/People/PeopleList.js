import React, { Component } from "react";
import { Table, Dimmer, Loader, Header, Icon, Button } from "semantic-ui-react";
import { Link } from "@reach/router";

class PeopleList extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: true };
    }

    componentDidMount() {
        fetch("http://localhost:8000/api/people")
            .then((response) => response.json())
            .then((data) => this.setState({ data: data.data, loading: false }));
    }

    render() {
        let data = this.state.data || [];
        let { loading } = this.state;

        return (
            <>
                {loading && (
                    <Dimmer active inverted>
                        <Loader>Loading Data...</Loader>
                    </Dimmer>
                )}
                <Header as="h1" dividing>
                    <Icon name="user" />
                    <Header.Content>People</Header.Content>
                </Header>
                <Button primary>Import People</Button>
                <Table celled padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell singleLine>
                                First Name
                            </Table.HeaderCell>
                            <Table.HeaderCell>Last Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Group</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.map((person, index) => {
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
                                    <Table.Cell singleLine>
                                        {person.group ? (
                                            <Link
                                                to={`/groups/${person.group.id}`}
                                            >
                                                {person.group.name}
                                            </Link>
                                        ) : (
                                            "N/A"
                                        )}
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

export default PeopleList;
