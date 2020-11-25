import React from "react";

interface IntegerFieldProps {
    name: string;
    value: string | number;
    min?: number;
    max?: number;
    placeholder?: string;
    onChange: (value: number | "") => void;
}

export const IntegerField = ({ name, value, min, max, placeholder, onChange }: IntegerFieldProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") onChange("");
        const isNumber = /^\d+$/.test(e.target.value);
        //console.debug(`handleNumericFieldChange: e.target.value = ${e.target.value}, numericValue = ${numericValue}, isNumber = ${isNumber}.`);
        if (!isNumber) return;
        const numericValue = parseInt(e.target.value);
        if (min !== undefined && numericValue < min) return;
        if (max !== undefined && numericValue > max) return;
        onChange(numericValue);
    };
    return <input type="text" name={name} value={value} onChange={handleChange} placeholder={placeholder} />;
};
