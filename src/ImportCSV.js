import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import ImportModal from "./ImportModal";
import Papa from "papaparse";

class FileImportButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            csvData: [],
            csvFields: [],
            importing: false,
            importButtonValue: "",
            importContext: "People", // controls whether we need to choose a group
        };
    }

    uploadPeople = () => {
        fetch(`//localhost:8000/api/people-import`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.csvData),
        })
            .then(({ ok, status }) => {
                if (!ok() && status === 400) {
                    alert("Error with import format.");
                }

                this.setState({
                    importing: false,
                    open: false,
                });
            })
            .catch((error) => {
                console.log(error);
                alert("There was an error importing.");
            });
    };

    uploadGroups = () => {
        fetch(`//localhost:8000/api/groups-import`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.csvData),
        })
            .then(({ ok, status }) => {
                if (!ok() && status === 400) {
                    alert("Error with import format.");
                }

                this.setState({
                    importing: false,
                    open: false,
                });
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
                console.log(results);
                let getImportContext = (fields) => {
                    const PEOPLE_FIELDS = [
                        "first_name",
                        "last_name",
                        "email_address",
                    ];
                    return fields.some((field) => {
                        return PEOPLE_FIELDS.includes(field);
                    })
                        ? "People"
                        : "Groups";
                };

                this.setState({
                    csvData: results.data,
                    csvFields: results.meta.fields,
                    open: true,
                    importButtonValue: "",
                    importContext: getImportContext(results.meta.fields),
                });
            },
        });
    };

    handleImport = () => {
        let { importContext } = this.state;
        console.log("HERE WE GO");
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
        this.props.onFinishImport();
    };

    render() {
        const { accept, text, onFinishImport } = this.props;
        const {
            csvData = [],
            csvFields = [],
            open,
            importButtonValue,
            importContext,
        } = this.state;

        return (
            <>
                <Button primary onClick={this.handleClick}>
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
                    onClose={onFinishImport}
                    records={csvData}
                    fields={csvFields}
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

                    {/* {
                        importContext === 'People' ?
                        <GroupSelector /> : null
                    } */}
                </ImportModal>
            </>
        );
    }
}

export default FileImportButton;
