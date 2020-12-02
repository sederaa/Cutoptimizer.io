import React from "react";
import styled from "styled-components";
import { Cuts } from "main/components/Cuts";
import { Stock } from "main/components/Stock";
import { Settings } from "main/components/Settings";
import { Section } from "main/components/Section";
import { CutModel } from "main/models/CutModel";

interface InputSectionProps {
    cuts: CutModel[];
    kerf: number;
    onKerfChanged: (kerf: number) => void;
    onCutsChanged: (cuts: CutModel[]) => void;
}

export const InputSection = ({ kerf, cuts, onKerfChanged, onCutsChanged }: InputSectionProps) => {
    return (
        <StyledInputSection>
            <Cuts cuts={cuts} onCutsChanged={onCutsChanged} />
            <Stock />
            <Settings kerf={kerf} onKerfChanged={onKerfChanged} />
        </StyledInputSection>
    );
};

const StyledInputSection = styled(Section)``;
