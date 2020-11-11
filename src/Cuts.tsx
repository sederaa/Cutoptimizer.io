import React from 'react';
import styled from 'styled-components';
import { List } from './List';

const StyledCuts = styled.section`
    padding: 1em;
`

export const Cuts = () => {
    return <StyledCuts>
        <h1>Cuts</h1>
        Enter your cuts here
        <List />
    </StyledCuts>
}