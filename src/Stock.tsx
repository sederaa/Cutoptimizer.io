import React from 'react';
import styled from 'styled-components';
 
const StyledStock = styled.section`
    padding: 1em;
`

export const Stock = () => {
    return <StyledStock>
        <h1>Stock</h1>
        Enter your Stock here
    </StyledStock>
}