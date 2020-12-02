import React from "react";
import styled from "styled-components";
import { Cuts } from "main/components/Cuts";
import { Stock } from "main/components/Stock";
import { Settings } from "main/components/Settings";
import { Section } from "main/components/Section";
import { CutModel } from "main/models/CutModel";
import { StockModel } from "main/models/StockModel";

interface InputSectionProps {
    cuts: CutModel[];
    stock: StockModel[];
    kerf: number;
    onKerfChanged: (kerf: number) => void;
    onCutsChanged: (cuts: CutModel[]) => void;
    onStockChanged: (stock: StockModel[]) => void;
}

export const InputSection = ({ kerf, cuts, stock, onKerfChanged, onCutsChanged, onStockChanged }: InputSectionProps) => {
    return (
        <StyledInputSection>
            <Cuts cuts={cuts} onCutsChanged={onCutsChanged} />
            <Stock stock={stock} onStockChanged={onStockChanged} />
            <Settings kerf={kerf} onKerfChanged={onKerfChanged} />
        </StyledInputSection>
    );
};

const StyledInputSection = styled(Section)``;
