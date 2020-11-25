import React from "react";
import styled from "styled-components";
import { List } from "common/components/List";
import { ListItemModel } from "common/models/ListItemModel";
import { Segment } from "main/services/createSolutionsTree";

interface CutsProps {
    cuts: Segment[];
    onCutsChanged: (cuts: Segment[]) => void;
}

export const Cuts = ({ cuts, onCutsChanged }: CutsProps) => {
    const handleItemsChanged = (items: ListItemModel[]) => {
        //console.debug(`Cuts: handleItemsChanged: items = `, items);
        onCutsChanged(items as Segment[]);
    };
    return (
        <StyledCuts>
            <h1>Cuts</h1>
            Enter your cuts here
            <List onItemsChanged={handleItemsChanged} />
        </StyledCuts>
    );
};

const StyledCuts = styled.section`
    padding: 1em;
`;
