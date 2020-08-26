import React from 'react';
import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';
import {Header} from './Header';
import {Tagline} from './Tagline';
import {InputSection} from './InputSection';
import {CutList} from './CutList';
import {Algo} from './Algo';
import styled from 'styled-components';
import clone from 'rfdc';

const StyledApp = styled.div`
`

const App = () => {

  

  return (
    <StyledApp>
      <Header />
      <Tagline />
      <InputSection />
      <CutList />
      <Algo />
    </StyledApp>
  );
}

export default App;
