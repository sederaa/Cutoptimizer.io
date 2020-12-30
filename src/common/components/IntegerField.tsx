import React from "react";

interface IntegerFieldProps {
    name: string;
    value: string | number;
    min?: number;
    max?: number;
    placeholder?: string;
    onChange: (value: number | null) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const IntegerField = ({ name, value, min, max, placeholder, onChange, onBlur }: IntegerFieldProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") onChange(null);
        const isNumber = /^\d+$/.test(e.target.value);
        if (!isNumber) return;
        const numericValue = parseInt(e.target.value);
        console.debug(
            `handleNumericFieldChange: e.target.value = ${e.target.value}, numericValue = ${numericValue}, isNumber = ${isNumber}.`
        );
        if (min !== undefined && numericValue < min) return;
        if (max !== undefined && numericValue > max) return;
        onChange(numericValue);
    };
    return (
        <input
            type="text"
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
        />
    );
};
