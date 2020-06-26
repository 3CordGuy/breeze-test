import React from "react";
import { Button, Modal } from "semantic-ui-react";

const ImportModal = ({
    showModal,
    onClose,
    onConfirm,
    closeModal,
    records = [],
    fields = [],
}) => {
    return (
        <div>
            <Modal
                open={showModal}
                closeOnEscape={false}
                closeOnDimmerClick={false}
                onClose={onClose}
            >
                <Modal.Header>
                    We are about to import {records.length} record(s)
                </Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to continue?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={closeModal} basic negative>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        positive
                        labelPosition="right"
                        icon="checkmark"
                        content="Yes"
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default ImportModal;
