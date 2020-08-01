import React from 'react';
import styled from 'styled-components';
 
const StyledHeader = styled.header`
    border-bottom: solid 1px #ccc;
    padding: 1em;
    div {
        max-width: 1200px;
        margin: 0 auto;    
    }
`

export const Header = () => {
    return <StyledHeader>
        <div>
            CUT OPTIMIZER
        </div>
    </StyledHeader>
}