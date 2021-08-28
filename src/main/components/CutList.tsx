import React, { useContext } from "react";
import styled from "styled-components";
import { Section } from "main/components/Section";
import { StockModel } from "main/models/StockModel";
import { Heading } from "common/components/Heading";
import { ThemeContext } from "styled-components";

const StyledCutList = styled(Section)`
    background-color: ${(props) => props.theme.colors.bold};
`;

interface CutListProps {
    solution?: StockModel[];
}

export const CutList = ({ solution }: CutListProps) => {
    const themeContext = useContext(ThemeContext);
    console.log("Current theme: ", themeContext);
    return (
        <StyledCutList>
            <Heading as="h2">Cut List</Heading>

            <svg
                width="100%"
                height="250"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{ border: "dashed 1px red" }}
            >
                <rect
                    x="0"
                    y="0"
                    rx="3"
                    ry="3"
                    width="50"
                    height="34"
                    stroke={themeContext.colors.border}
                    fill="transparent"
                    strokeWidth="1"
                />
            </svg>

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
