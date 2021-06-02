import React from "react";
import styled from "styled-components";

const StyledSection = styled.section`
    padding: 1em;
    div {
        max-width: 1200px;
        margin: 0 auto;
    }
`;

interface SectionProps {
    children: React.ReactNode;
    className?: string;
}

export const Section = ({ children, className }: SectionProps) => {
    return <StyledSection className={className}>{children}</StyledSection>;
};
