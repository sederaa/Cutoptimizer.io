import React from "react";
import styled from "styled-components";
import { List } from "common/components/List";
import { ListItemModel } from "common/models/ListItemModel";
import { CutModel } from "main/models/CutModel";
import { ModelErrorsArray } from "main/models/InputModel";

interface CutsProps {
    cuts: CutModel[];
    onCutsChanged: (cuts: CutModel[]) => void;
    errors?: ModelErrorsArray<CutModel>;
}

export const Cuts = ({ cuts, onCutsChanged, errors }: CutsProps) => {
    const handleItemsChanged = (items: ListItemModel[]) => {
        //console.debug(`Cuts: handleItemsChanged: items = `, items);
        onCutsChanged(items as CutModel[]);
    };
    return (
        <StyledCuts>
            <h1>Cuts</h1>
            Enter your cuts here
            <List items={cuts} onItemsChanged={handleItemsChanged} errors={errors} />
        </StyledCuts>
    );
};

const StyledCuts = styled.section`
    padding: 1em;
`;
