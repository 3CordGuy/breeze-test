import React, { Component } from "react";
import { Table, Header, Dimmer, Loader, Icon } from "semantic-ui-react";
import { Link } from "@reach/router";
import _ from "lodash";

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            column: "name",
            direction: "descending",
        };
    }

    handleSort = (clickedColumn) => () => {
        const { column, data, direction } = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]),
                direction: "ascending",
            });

            return;
        }

        this.setState({
            data: data.reverse(),
            direction: direction === "ascending" ? "descending" : "ascending",
        });
    };

    componentDidMount() {
        fetch("http://localhost:8000/api/groups")
            .then((response) => response.json())
            .then(({ data }) =>
                this.setState({
                    loading: false,
                    data: _.sortBy(data, ["name", "descending"]),
                }),
            );
    }

    render() {
        let data = this.state.data || [];
        let { column, direction, loading } = this.state;

        return (
            <>
                {loading && (
                    <Dimmer active inverted>
                        <Loader>Loading Data...</Loader>
                    </Dimmer>
                )}
                <Header as="h1">
                    <Icon name="users" />
                    Groups
                </Header>
                <Table celled padded basic="very" sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                singleLine
                                sorted={column === "name" ? direction : null}
                                onClick={this.handleSort("name")}
                            >
                                Name
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.map((group, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell singleLine>
                                        <Link to={`${group.id}`}>
                                            {group.name}
                                        </Link>
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

export default GroupList;
