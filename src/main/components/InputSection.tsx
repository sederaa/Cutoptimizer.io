import React from "react";
import styled from "styled-components";
import { Cuts } from "main/components/Cuts";
import { Stock } from "main/components/Stock";
import { Settings } from "main/components/Settings";
import { Section } from "main/components/Section";

const StyledInputSection = styled(Section)``;

export const InputSection = () => {
    return (
        <StyledInputSection>
            <Cuts />
            <Stock />
            <Settings />
        </StyledInputSection>
    );
};
