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
      { id: 0, len: 5, done: false },
      { id: 1, len: 5, done: false },
      { id: 2, len: 5, done: false },
      { id: 3, len: 5, done: false }
    ],
    stock: [
      { id: 0, len: 20, segments: [], price: 0 },
      { id: 1, len: 20, segments: [], price: 0 }
    ],
    buyableStock: [
      { id: 1001, len: 15, segments: [], price: 1.23 },
      { id: 1002, len: 20, segments: [], price: 2.34 },
    ] //,
    //actions: []
  };

  const kerf = 1;

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
    //log(state,`createSolution: start.`);
    //log(state,`stockId = ${stockId}.`);
    let segment = state.segments.find(c => !c.done);
    //log(state,`segmentId = ${segment.id} (len = ${segment.len}, done = ${segment.done}).`);
    //console.debug(`segment to fit: `, segment);
    let stock = state.stock.find(s => s.id === stockId);
    let buyableStock = state.buyableStock.find(s => s.id === stockId);
    if (buyableStock){
      //console.debug(`Found buyable stock ${buyableStock.id}, cloning and adding to stock...`);
      stock = clone()(buyableStock);
      stock.id = state.stock.reduce((highest, currentValue) => highest = Math.max(highest, currentValue.id), 0) + 1;
      state.stock.push(stock);
      //log(state,`added buyable stock with new id = ${stock.id}.`);
    }
    //log(state,`stock.id = ${stock.id} (len = ${stock.len}).`);
    
    state.path = state.path || "";
    state.path += ` (segment=${segment.id},stock=${stock.id})`;

    if (segment.len <= (stock.len - stock.segments.reduce((accumulator, currentValue) => accumulator + currentValue.len, 0))) {
      //log(state,`segment fits stock, adding segment to stock.segments list and setting done...`);
      stock.segments.push(segment);
      segment.done = true;
      if (stock.len > stock.segments.reduce((accumulator, currentValue) => accumulator + currentValue.len, 0)){
        stock.segments.push({id: -1, type:"kerf", len: kerf});
      }

    } else if (state.buyableStock.some(bs => bs.len >= segment.len)) {
      //console.debug(`Can't fit segment ${segment.id} into stock ${stock.id}, but there is buyable stock that would fit.`);
      //log(state,`segment doesn't fit stock, but fits some buyable stock, looping through buyable stock...`);
      for (const buyableStock of state.buyableStock.filter(bs => bs.len >= segment.len)) {
        //console.debug(`Would call createSolution with id ${buyableStock.id}. state = `, state);
        //log(state,`calling createSolution with buyableStock.id ${buyableStock.id}...`);
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

// const log = (stateArg, message) => {
//   stateArg.actions.push(`${getRandom(10000,99999)}: ${message}`);
// }

// const getRandom = (min,max) => {
//   return Math.random() * (max - min) + min;
// }





