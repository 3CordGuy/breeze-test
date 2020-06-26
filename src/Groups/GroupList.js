import React, { Component } from "react";
import { Table, Header } from "semantic-ui-react";
import { Link } from "@reach/router";
import _ from "lodash";

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                this.setState({ data: _.sortBy(data, ["name", "descending"]) }),
            );
    }

    render() {
        let data = this.state.data || [];
        let { column, direction } = this.state;

        return (
            <>
                <Header as="h1">Groups</Header>
                <Table celled padded sortable selectable>
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
                                        <Link to="#">{group.name}</Link>
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
