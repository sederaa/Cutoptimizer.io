import React from "react";
import styled from "styled-components";
import { List } from "common/components/List";
import { ListItemModel } from "common/models/ListItemModel";
import { StockModel } from "main/models/StockModel";

interface StockProps {
    stock: StockModel[];
    onStockChanged: (stock: StockModel[]) => void;
}
export const Stock = ({ stock, onStockChanged }: StockProps) => {
    const handleItemsChanged = (items: ListItemModel[]) => {
        //console.debug(`Stock: handleItemsChanged: items = `, items);
        onStockChanged(items as StockModel[]);
    };
    return (
        <StyledStock>
            <h1>Stock</h1>
            Enter your Stock here
            <List items={stock} onItemsChanged={handleItemsChanged} />
        </StyledStock>
    );
};

const StyledStock = styled.section`
    padding: 1em;
`;
