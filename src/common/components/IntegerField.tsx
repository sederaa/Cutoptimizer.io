import React from "react";
import { StyledInput } from "common/components/StyledInput";

interface IntegerFieldProps {
    id: string;
    name: string;
    value: string | number;
    min?: number;
    max?: number;
    label?: string;
    error?: string;
    onChange: (value: number | null) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const IntegerField = ({ id, name, value, min, max, label, error, onChange, onBlur }: IntegerFieldProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = parseInt(e.target.value);
        if (Number.isNaN(numericValue)) {
            onChange(null);
            return;
        }
        //console.debug(`handleNumericFieldChange: e.target.value = ${e.target.value}, numericValue = ${numericValue}, isNumber = ${isNumber}.`);
        if (min !== undefined && numericValue < min) return;
        if (max !== undefined && numericValue > max) return;
        onChange(numericValue);
    };
    return (
        <div style={{ position: "relative", display: "inline" }}>
            <StyledInput
                id={id}
                type="text"
                name={name}
                value={value}
                className={error !== undefined ? "error" : undefined}
                style={false && error !== undefined ? { borderColor: "red" } : undefined}
                onChange={handleChange}
                onBlur={onBlur}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                    ![
                        "0",
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "End",
                        "Home",
                        "Tab",
                    ].includes(event.key) && event.preventDefault()
                }
                placeholder=" "
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};
