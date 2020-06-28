import React, { Component } from "react";
import { Button, Table, Dropdown } from "semantic-ui-react";
import ImportModal from "./ImportModal";
import Papa from "papaparse";
import API from "./API";
import { navigate } from "@reach/router";

const PEOPLE_FIELDS = [
    "id",
    "first_name",
    "last_name",
    "email_address",
    "status",
];
const GROUP_FIELDS = ["id", "name"];

const getSampleRecord = (importType, record) => {
    const FIELDS = importType === "People" ? PEOPLE_FIELDS : GROUP_FIELDS;

    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Breeze Field Matched</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {FIELDS.map((field) => (
                    <Table.Row key={field}>
                        <Table.Cell
                            positive={!!record[field]}
                            negative={!record[field]}
                        >
                            {field}
                        </Table.Cell>
                        <Table.Cell
                            positive={!!record[field]}
                            negative={!record[field]}
                        >
                            {record[field]}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

class FileImportButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            csvData: [],
            csvFields: [],
            groups: [],
            firstRecord: null,
            hasErrors: false,
            importing: false,
            importIntoGroupID: null,
            importButtonValue: "",
            importContext: "People", // controls whether we need to choose a group
        };
    }

    getGroups = () => {
        API.getGroups()
            .then(({ data }) => {
                this.setState({
                    groups: data.map((group) => ({
                        key: group.id,
                        value: group.id,
                        text: group.name,
                    })),
                });
            })
            .catch((error) => {
                // TODO: actual error reporting would be nice ;)
                alert("Error fetching groups...");
            });
    };

    uploadPeople = () => {
        const { location } = this.props;
        let people = this.state.csvData;
        let groupID = getUrlID(location);

        if (this.state.importIntoGroupID || groupID) {
            people = people.map((person) => ({
                ...person,
                group_id: this.state.importIntoGroupID || groupID,
            }));
        }

        API.importPeople(people)
            .then(({ ok, status }) => {
                if (!ok && status === 400) {
                    alert("Error with import format.");
                }

                this.setState({
                    importing: false,
                    open: false,
                });

                if (groupID || this.props.location.pathname === "/people") {
                    this.props.onFinish && this.props.onFinish();
                } else {
                    navigate("/people");
                }
            })
            .catch((error) => {
                console.log(error);
                alert("There was an error importing.");
            });
    };

    uploadGroups = () => {
        API.importGroups(this.state.csvData)
            .then(({ ok, status }) => {
                if (!ok && status === 400) {
                    alert("Error with import format.");
                }

                this.setState({
                    importing: false,
                    open: false,
                });

                if (this.props.location.pathname === "/groups") {
                    this.props.onFinish && this.props.onFinish();
                } else {
                    navigate("/groups");
                }
            })
            .catch((error) => {
                console.log(error);
                alert("There was an error importing.");
            });
    };

    handleFile = (files) => {
        Papa.parse(new Blob(files, { type: "text/csv" }), {
            delimiter: ",",
            newline: "", // auto-detect
            quoteChar: '"',
            escapeChar: "\\",
            skipEmptyLines: true,
            dynamicTyping: true,
            header: true,
            error: (error) => {
                alert(
                    `There was an error parsing your csv. Please check your formatting and try again.\n\n ${error}`,
                );
            },
            complete: (results) => {
                let importContext = getImportContext(results.meta.fields);
                let csvFields = results.meta.fields;

                // We need groups for the dropdown
                if (
                    importContext === "People" &&
                    !csvFields.includes("group_id")
                ) {
                    this.getGroups();
                }

                this.setState({
                    firstRecord: results.data[0],
                    csvData: results.data,
                    csvFields,
                    open: true,
                    importButtonValue: "",
                    importContext,
                });
            },
        });
    };

    handleGroupSelect = (e, data) => {
        this.setState({
            importIntoGroupID: data.value,
        });
    };

    handleImport = () => {
        let { importContext } = this.state;

        if (importContext === "People") {
            this.uploadPeople();
        } else if (importContext === "Groups") {
            this.uploadGroups();
        }
    };

    handleClick = () => {
        this.inputFileRef.click();
    };

    dismissModal = () => {
        this.setState({ open: false });
        this.props.onFinish && this.props.onFinish();
    };

    render() {
        const {
            csvData = [],
            groups,
            csvFields,
            open,
            firstRecord,
            importIntoGroupID,
            importButtonValue,
            importContext,
        } = this.state;
        const { accept, text } = this.props;
        const hasGroupID = csvFields.includes("group_id");

        return (
            <>
                <Button primary onClick={this.handleClick} floated="right">
                    <input
                        type="file"
                        accept={accept}
                        ref={(fileInput) => (this.inputFileRef = fileInput)}
                        style={{ display: "none" }}
                        value={importButtonValue}
                        onChange={(e) => this.handleFile(e.target.files)}
                    />
                    {text}
                </Button>
                <ImportModal
                    onConfirm={this.handleImport}
                    closeModal={this.dismissModal}
                    showModal={open}
                    confirmText="Let's do it!"
                >
                    <p>
                        Good News! We found{" "}
                        <strong>
                            {csvData.length} {importContext}
                        </strong>{" "}
                        in your file that we can import.
                    </p>
                    <strong>Preview the first record below:</strong>
                    {firstRecord && getSampleRecord(importContext, firstRecord)}
                    {!hasGroupID &&
                    groups.length &&
                    importContext === "People" ? (
                        <div>
                            <p>
                                Would you like to add all these folks into a
                                group? <em>(optional)</em>
                            </p>{" "}
                            <Dropdown
                                selection
                                selectOnBlur={false}
                                placeholder="Import into Group"
                                value={importIntoGroupID}
                                onChange={this.handleGroupSelect}
                                options={groups}
                            ></Dropdown>
                        </div>
                    ) : null}
                </ImportModal>
            </>
        );
    }
}

export default FileImportButton;

function getImportContext(fields) {
    return fields.some((field) => {
        return ["email_address", "first_name", "last_name"].includes(field);
    })
        ? "People"
        : "Groups";
}

function getUrlID(location) {
    if (!location) return;

    let urlParts = location.pathname && location.pathname.split("/");
    return urlParts[2];
}
