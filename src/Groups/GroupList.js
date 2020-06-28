import React, { Component } from "react";
import { Table, Header, Dimmer, Loader, Icon } from "semantic-ui-react";
import { Link, Location } from "@reach/router";
import _ from "lodash";
import dayjs from "dayjs";
import API from "../API";
import ImportCSV from "../ImportCSV";

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            column: "name",
            direction: "asc",
        };
    }

    handleSort = (clickedColumn) => () => {
        const { column, data, direction } = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.orderBy(data, [clickedColumn], ["asc"]),
                direction: "asc",
            });

            return;
        }

        this.setState({
            data: data.reverse(),
            direction: direction === "asc" ? "desc" : "asc",
        });
    };

    getGroups = () => {
        this.setState({ loading: true });
        API.getGroups().then(({ data }) => {
            data = data.map((row) => ({
                ...row,
                // unix timestamp for easier sorting
                timestamp: dayjs(row.created_at).valueOf(),
            }));

            this.setState({
                loading: false,
                data: _.orderBy(data, "name", ["asc"]),
            });
        });
    };

    componentDidMount() {
        this.getGroups();
    }

    render() {
        let data = this.state.data || [];
        let { column, direction, loading } = this.state;
        direction = direction === "asc" ? "ascending" : "descending";

        return (
            <>
                {loading && (
                    <Dimmer active inverted>
                        <Loader>Loading Data...</Loader>
                    </Dimmer>
                )}
                <Header as="h1" dividing>
                    <Icon name="users" />
                    <Header.Content as="div" style={{ width: "100%" }}>
                        Groups
                        <Location>
                            {({ location }) => (
                                <ImportCSV
                                    text="Upload CSV"
                                    location={location}
                                    onFinish={this.getGroups}
                                />
                            )}
                        </Location>
                    </Header.Content>
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
                        {data.length ? (
                            data.map((group, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell singleLine>
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
                            })
                        ) : (
                            <Table.Row>
                                <Table.Cell textAlign="center">
                                    There are no Groups yet!{" "}
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

export default GroupList;
