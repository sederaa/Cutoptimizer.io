import React, { useState } from "react";
import styled from "styled-components";
import { IntegerField } from "common/components/IntegerField";

interface SettingsProps {
    kerf: number;
    onKerfChanged: (kerf: number) => void;
}

export const Settings = ({ kerf, onKerfChanged }: SettingsProps) => {
    //const [kerf, setKerf] = useState<number | "">("");

    return (
        <StyledSettings>
            <h1>Settings</h1>
            Kerf
            <br />
            <IntegerField name="kerf" value={kerf} onChange={(kerf) => onKerfChanged(kerf ?? 0)} placeholder="Kerf" min={0} max={999} />
        </StyledSettings>
    );
};

const StyledSettings = styled.section`
    padding: 1em;
`;
