import React from 'react';
import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';
import {Header} from './Header';
import {Tagline} from './Tagline';
import {InputSection} from './InputSection';
import {CutList} from './CutList';
import styled from 'styled-components';
import { createSolutions, CreateSolutionsProps, Segment, Stock, BuyableStock } from './createSolutions';


const StyledApp = styled.div`
`

const App = () => {

  // Non-obvious solution, where all segments are taken from 2nd stock piece. trips up most other optimizers.
  // let originalState = {
  //   segments: [
  //     { id: 0, len: 16, done: false },
  //     { id: 1, len: 16, done: false },
  //     { id: 2, len: 16, done: false },
  //     { id: 3, len: 16, done: false }
  //   ],
  //   stock: [
  //     { id: 0, len: 63, segments: [] },
  //     { id: 1, len: 64, segments: [] }
  //   ]
  // };

  let props = {
    segments: [
      { id: 1, length: 5, quantity: 1 } as Segment,
      { id: 2, length: 5, quantity: 1 } as Segment,
      /*
      { id: 3, length: 5, quantity: 1 } as Segment,
      { id: 4, length: 5, quantity: 1 } as Segment,
      { id: 5, length: 5, quantity: 1 } as Segment,
      { id: 0, length: 5, quantity: 2 } as Segment,
      */
    ],
    stock: [
      { id: 1, length: 20, price: 0, quantity: 1 } as Stock,
      { id: 2, length: 10, price: 0, quantity: 1 } as Stock,
      /*
      { id: 0, length: 20, price: 0, quantity: 2 } as Stock,
      { id: 1, length: 40, price: 0, quantity: 1 } as Stock*/
    ],
    buyableStocks: [
      /*
      { id: 1001, length: 15, price: 1.23 } as BuyableStock,
      { id: 1002, length: 20, price: 2.34 } as BuyableStock,
      */
    ],
    kerf: 0
  } as CreateSolutionsProps;

const solutions = createSolutions(props);
console.debug(`SOLUTIONS: `, solutions);

solutions.forEach(s=>console.debug(s._path));

  return (
    <StyledApp>
      <Header />
      <Tagline />
      <InputSection />
      <CutList />
    </StyledApp>
  );
}

export default App;
