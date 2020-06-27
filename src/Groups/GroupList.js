import React, { Component } from "react";
import { Table, Header, Dimmer, Loader, Icon } from "semantic-ui-react";
import { Link } from "@reach/router";
import _ from "lodash";
import dayjs from "dayjs";
import ImportCSV from "../ImportCSV";

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

    fetchGroups = () => {
        fetch("http://localhost:8000/api/groups")
            .then((response) => response.json())
            .then(({ data }) => {
                data = data.map((row) => ({
                    ...row,
                    // unix timestamp for easier sorting
                    timestamp: dayjs(row.created_at).valueOf(),
                }));

                this.setState({
                    loading: false,
                    data: _.sortBy(data, ["name", "descending"]),
                });
            });
    };

    componentDidMount() {
        this.fetchGroups();
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
                <Header as="h1" dividing>
                    <Icon name="users" />
                    Groups
                </Header>

                <ImportCSV
                    text="Import Groups"
                    onFinishImport={this.fetchGroups}
                />

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
                            <Table.HeaderCell
                                sorted={
                                    column === "timestamp" ? direction : null
                                }
                                onClick={this.handleSort("timestamp")}
                            >
                                Date Created
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
                                        <Link to={`${group.id}`}>
                                            {group.name}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell singleLine>
                                        {dayjs(group.created_at).format(
                                            "MMMM D, YYYY",
                                        )}
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
