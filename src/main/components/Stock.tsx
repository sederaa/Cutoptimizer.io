import React from "react";
import styled from "styled-components";
import { List } from "common/components/List";
import { ListItemModel } from "common/models/ListItemModel";

export const Stock = () => {
    return (
        <StyledStock>
            <h1>Stock</h1>
            Enter your Stock here
            <List onItemsChanged={(items: ListItemModel[]) => {}} />
        </StyledStock>
    );
};

const StyledStock = styled.section`
    padding: 1em;
`;
