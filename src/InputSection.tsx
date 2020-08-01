import React from 'react';
import styled from 'styled-components';
import {Cuts} from './Cuts';
import {Stock} from './Stock';
import {Settings} from './Settings';
import {Section} from './Section';
 
const StyledInputSection = styled(Section)`
`

export const InputSection = () => {
    return <StyledInputSection>
        <Cuts />
        <Stock />
        <Settings />
    </StyledInputSection>
}