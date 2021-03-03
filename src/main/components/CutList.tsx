import React from "react";
import styled from "styled-components";
import { Section } from "main/components/Section";
import { StockModel } from "main/models/StockModel";

const StyledCutList = styled(Section)``;

interface CutListProps {
    solution?: StockModel[];
}

export const CutList = ({ solution }: CutListProps) => {
    return (
        <StyledCutList>
            <ul>
                {solution &&
                    solution.map((stock) => (
                        <li key={stock.instanceId}>
                            {stock.id}. {stock.name} len={stock.length}
                            <ul>
                                {stock._cuts?.map((cut) => (
                                    <li key={cut.instanceId}>
                                        {cut.id}. {cut.name} len={cut.length}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
            </ul>
        </StyledCutList>
    );
};
