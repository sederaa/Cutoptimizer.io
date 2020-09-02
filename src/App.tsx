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
import { createSolutions, CreateSolutionsProps, Segment, Stock, BuyableStock } from './createSolutions';


const StyledApp = styled.div`
`

const App = () => {

  let props = {
    segments: [
      { id: 0, length: 5, quantity: 5 } as Segment,
    ],
    stock: [
      { id: 0, length: 20, price: 0, quantity: 2 } as Stock,
      { id: 1, length: 40, price: 0, quantity: 1 } as Stock
    ],
    buyableStocks: [
      { id: 1001, length: 15, price: 1.23 } as BuyableStock,
      { id: 1002, length: 20, price: 2.34 } as BuyableStock,
    ],
    kerf: 1
  } as CreateSolutionsProps;

const solutions = createSolutions(props);
console.debug(solutions);

  return (
    <StyledApp>
      <Header />
      <Tagline />
      <InputSection />
      <CutList />
      {/* <Algo /> */}
    </StyledApp>
  );
}

export default App;
