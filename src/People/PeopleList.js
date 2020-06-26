import React, { Component } from "react";
import { Table, Dimmer, Loader, Header, Icon } from "semantic-ui-react";

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
                <Header as="h1">
                    <Icon name="user" />
                    <Header.Content>People</Header.Content>
                </Header>
                <Table celled padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell singleLine>
                                First Name
                            </Table.HeaderCell>
                            <Table.HeaderCell>Last Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
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
