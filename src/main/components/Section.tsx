import React from "react";
import styled from "styled-components";

const StyledSection = styled.section`
    border-bottom: solid 1px #ccc;
    padding: 1em;
    div {
        max-width: 1200px;
        margin: 0 auto;
    }
`;

interface SectionProps {
    children: React.ReactNode;
}

export const Section = ({ children }: SectionProps) => {
    return (
        <StyledSection>
            <div>{children}</div>
        </StyledSection>
    );
};
