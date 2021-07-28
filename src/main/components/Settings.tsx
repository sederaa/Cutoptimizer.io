import React, { useState } from "react";
import styled from "styled-components";
import { IntegerField } from "common/components/IntegerField";
import { Heading } from "common/components/Heading";
import { Section } from "main/components/Section";

interface SettingsProps {
    kerf: number;
    kerfError: string | undefined;
    onKerfChanged: (kerf: number) => void;
}

export const Settings = ({ kerf, onKerfChanged, kerfError }: SettingsProps) => {
    return (
        <StyledSettings>
            <Heading as="h2">Settings</Heading>
            Kerf
            <br />
            <IntegerField
                id="kerf"
                name="kerf"
                value={kerf}
                onChange={(kerf) => onKerfChanged(kerf ?? 0)}
                label="Kerf"
                min={0}
                max={999}
            />
        </StyledSettings>
    );
};

const StyledSettings = styled(Section)`
    background-color: ${(props) => props.theme.colors.light};
`;
