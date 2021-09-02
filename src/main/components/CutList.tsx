import React from "react";
import styled from "styled-components";
import { Section } from "main/components/Section";
import { StockModel } from "main/models/StockModel";
import { CutModel } from "main/models/CutModel";
import { Heading } from "common/components/Heading";

const StyledCutList = styled(Section)`
    background-color: ${(props) => props.theme.colors.bold};
`;

interface CutListProps {
    solution?: StockModel[];
}

export const CutList = ({ solution }: CutListProps) => {
    const maxWidth = solution
        ?.map((s) => s.length)
        .sort()
        .slice(-1)[0];

    return (
        <StyledCutList>
            <Heading as="h2">Cut List</Heading>

            {solution && maxWidth !== undefined ? (
                solution.map((stock, index) => (
                    <Stock
                        key={stock.instanceId}
                        stock={stock}
                        previousStock={index > 0 ? solution[index - 1] : undefined}
                        maxWidth={maxWidth}
                    />
                ))
            ) : (
                <>No solution found.</>
            )}

            {/* <ul>
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
            </ul> */}
        </StyledCutList>
    );
};

interface StockProps {
    stock: StockModel;
    previousStock?: StockModel;
    maxWidth: number;
}

const StyledStock = styled.div<StockProps>`
    display: flex;
    border: solid 1px ${(props) => props.theme.colors.border};
    border-radius: 3px;
    width: ${(props) => (props.stock.length / props.maxWidth) * 100}%;
    background: repeating-linear-gradient(
        -45deg,
        grey,
        grey 6px,
        ${(props) => props.theme.colors.border} 6px,
        ${(props) => props.theme.colors.border} 12px
    );
    margin: 3px 0;

    & > div {
        border-right: solid 1px ${(props) => props.theme.colors.border};
    }

    & > div:first-child {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    & > div:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-right: none;
    }
`;

const Stock = ({ stock, previousStock, maxWidth }: StockProps) => {
    return (
        <>
            {(previousStock === undefined || stock.id !== previousStock.id) && (
                <div style={{ marginTop: "1em" }}>
                    {stock.length} ({stock.name})
                </div>
            )}
            <StyledStock stock={stock} maxWidth={maxWidth}>
                {stock._cuts?.map((cut) => (
                    <Cut key={cut.instanceId} cut={cut} stockLength={stock.length} />
                ))}
            </StyledStock>
        </>
    );
};

interface CutProps {
    cut: CutModel;
    stockLength: number;
}

const StyledCut = styled.div<CutProps>`
    flex-basis: ${(props) => (props.cut.length / props.stockLength) * 100}%;
    background-color: white;
    text-align: center;
`;

const Cut = ({ cut, stockLength }: CutProps) => {
    return (
        <StyledCut cut={cut} stockLength={stockLength}>
            {cut.length} ({cut.name})
        </StyledCut>
    );
};
