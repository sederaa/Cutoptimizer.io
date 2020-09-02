import React from 'react';
import clone from 'rfdc';

export const Algo = () => {

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


  let originalState = {
    segments: [
      { id: 0, len: 16, done: false },
      { id: 1, len: 16, done: false },
      { id: 2, len: 16, done: false },
      { id: 3, len: 16, done: false }
    ],
    stock: [
      { id: 0, len: 15, segments: [], price: 0 },
      { id: 1, len: 18, segments: [], price: 0 }
    ],
    buyableStock: [
      { id: 2, len: 15, segments: [], price: 1.23 },
      { id: 3, len: 20, segments: [], price: 2.34 },
    ]
  };

  // Pre-condition: All stock & buyablestock must have unique ids

  console.debug(`Starting state: `, originalState);

  const addTotalsToSolution = (stateArg) => {
    stateArg.stock.forEach(s => s.used = s.segments.reduce((accumulator2, currentValue2) => accumulator2 + currentValue2.len, 0));
    stateArg.stock.forEach(s => s.waste = s.len - s.used);
    stateArg.wasteTotal = stateArg.stock.reduce((accumulator, currentValue) => accumulator + currentValue.waste, 0);
    stateArg.wastePieces = stateArg.stock.reduce((accumulator, currentValue) => accumulator + (currentValue.waste > 0 ? 1 : 0), 0);
    stateArg.cost = stateArg.stock.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
    return stateArg;
  }

  const createSolution = (stateArg, stockId) => {
    //console.group(`optimize: stockId = ${stockId}.`)
    let state = clone()(stateArg);
    //console.debug(`optimize: stateArg = `, state, `, stockId = ${stockId}.`);
    let segment = state.segments.find(c => !c.done);

    //console.debug(`segment to fit: `, segment);
    let stock = state.stock.find(s => s.id === stockId);
    let buyableStock = state.buyableStock.find(s => s.id === stockId);
    if (buyableStock){
      //console.debug(`Found buyable stock ${buyableStock.id}, cloning and adding to stock...`);
      stock = clone()(buyableStock);
      state.stock.push(stock);
    }

    state.path = state.path || "";
    state.path += ` (segment=${segment.id},stock=${stock.id})`;

    if (segment.len <= (stock.len - stock.segments.reduce((accumulator, currentValue) => accumulator + currentValue.len, 0))) {
      stock.segments.push(segment);
      segment.done = true;
    } else if (state.buyableStock.some(bs => bs.len >= segment.len)) {
      //console.debug(`Can't fit segment ${segment.id} into stock ${stock.id}, but there is buyable stock that would fit.`);
  
      for (const buyableStock of state.buyableStock.filter(bs => bs.len >= segment.len)) {
        //console.debug(`Would call createSolution with id ${buyableStock.id}. state = `, state);
        createSolution(state, buyableStock.id);
      }
  
      return;
  
    } else {
      //console.debug(`Can't fit segment ${segment.id} into stock ${stock.id}. Bailing out...`);
      //console.groupEnd();
      return;
    }

    if (state.segments.every(c => c.done)) {
      console.info(`Solution: `, addTotalsToSolution(state));
      //console.groupEnd();
      return;

    }

    for (const stock of state.stock) {
      //console.debug(`Calling optimize with: stock.id = ${stock.id}`);
      createSolution(state, stock.id);
    }
    //console.groupEnd();
  };

  for (const stock of originalState.stock) {
    //console.debug(`Calling optimize with: stock.id ${stock.id}`);
    createSolution(originalState, stock.id);
  }

  return <></>;
}

/*
TODO:
- Handle buying stock where needed

*/