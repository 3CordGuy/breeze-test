import React, { useRef } from "react";
import { Button } from "semantic-ui-react";

const FileImportButton = ({
    onChange,
    text = "Choose File",
    accept = ".csv",
    value,
}) => {
    const inputFileRef = useRef(null);

    const handleClick = () => {
        inputFileRef.current.click();
    };

    return (
        <Button primary onClick={handleClick}>
            <input
                type="file"
                accept={accept}
                ref={inputFileRef}
                style={{ display: "none" }}
                value={value}
                onChange={(e) => onChange(e.target.files)}
            />
            {text}
        </Button>
    );
};

export default FileImportButton;
