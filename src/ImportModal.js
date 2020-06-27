import React from "react";
import { Button, Modal } from "semantic-ui-react";

const ImportModal = ({
    showModal,
    onClose,
    onConfirm,
    closeModal,
    confirmText,
    children,
}) => {
    return (
        <div>
            <Modal
                open={showModal}
                closeOnEscape={false}
                closeOnDimmerClick={false}
                onClose={onClose}
            >
                <Modal.Header>We are almost ready to import...</Modal.Header>
                <Modal.Content>{children}</Modal.Content>
                <Modal.Actions>
                    <Button onClick={closeModal} basic negative>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        positive
                        labelPosition="right"
                        icon="checkmark"
                        content={confirmText || "Yes"}
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default ImportModal;
