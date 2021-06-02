import React from "react";
import styled from "styled-components";
import { Section } from "main/components/Section";
import { StockModel } from "main/models/StockModel";
import { Heading } from "common/components/Heading";

const StyledCutList = styled(Section)`
    background-color: ${(props) => props.theme.colors.bold};
`;

interface CutListProps {
    solution?: StockModel[];
}

export const CutList = ({ solution }: CutListProps) => {
    return (
        <StyledCutList>
            <Heading as="h2">Cut List</Heading>
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
