import React, { useState } from 'react';
import styled from 'styled-components';
import { IntegerField } from 'common/components/IntegerField';

const StyledSettings = styled.section`
    padding: 1em;
`

export const Settings = () => {
    const [kerf, setKerf] = useState<number | "">("");

    return <StyledSettings>
        <h1>Settings</h1>
        Enter your Settings here<br />
        <IntegerField name="kerf" value={kerf} onChange={setKerf} placeholder="Kerf" min={0} max={999} />
    </StyledSettings>
}