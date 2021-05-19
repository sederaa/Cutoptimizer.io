import React from "react";
import styled from "styled-components";
import { List } from "common/components/List";
import { ListItemModel } from "common/models/ListItemModel";
import { StockModel } from "main/models/StockModel";
import { ModelErrorsArray } from "main/models/InputModel";

interface StockProps {
    stock: StockModel[];
    onStockChanged: (stock: StockModel[]) => void;
    errors?: ModelErrorsArray<StockModel>;
}
export const Stock = ({ stock, onStockChanged, errors }: StockProps) => {
    const handleItemsChanged = (items: ListItemModel[]) => {
        //console.debug(`Stock: handleItemsChanged: items = `, items);
        onStockChanged(items as StockModel[]);
    };
    return (
        <StyledStock>
            <h1>Stock</h1>
            Enter your Stock here
            <List items={stock} onItemsChanged={handleItemsChanged} errors={errors} />
        </StyledStock>
    );
};

const StyledStock = styled.section`
    padding: 1em;
`;
