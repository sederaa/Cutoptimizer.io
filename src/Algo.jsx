import React from 'react';
import clone from 'rfdc';

export const Algo = () => {

  let state = {
    cuts: [
      { id: 0, len: 16, done: false },
      { id: 1, len: 16, done: false },
      { id: 2, len: 16, done: false },
      { id: 3, len: 16, done: false }
    ],
    stock: [
      { id: 0, len: 63, cuts: [] },
      { id: 1, len: 64, cuts: [] }
    ]
  };

  console.debug(`Starting state: `, state);

  const addTotalsToSolution = (stateArg) => {
    stateArg.stock.forEach(s => s.used = s.cuts.reduce((accumulator2, currentValue2) => accumulator2 + currentValue2.len, 0));
    stateArg.stock.forEach(s => s.waste = s.len - s.used);
    stateArg.wasteTotal = stateArg.stock.reduce((accumulator, currentValue) => accumulator + currentValue.waste, 0);
    stateArg.wastePieces = stateArg.stock.reduce((accumulator, currentValue) => accumulator + (currentValue.waste > 0 ? 1 : 0), 0);
    return stateArg;
  }

  const createSolution = (stateArg, stockIndex) => {
    //console.group(`optimize: stockIndex = ${stockIndex}.`)
    stockIndex = stockIndex || 0;
    let clonedState = clone()(stateArg);
    //console.debug(`optimize: stateArg = `, clonedState, `, stockIndex = ${stockIndex}.`);
    let cut = clonedState.cuts.find(c => !c.done);

    //console.debug(`Cut to fit: `, cut);
    let stock = clonedState.stock[stockIndex];

    clonedState.path = clonedState.path || "";
    clonedState.path += ` (cut=${cut.id},stock=${stock.id})`;

    if (cut.len <= (stock.len - stock.cuts.reduce((accumulator, currentValue) => accumulator + currentValue.len, 0))) {
      clonedState.stock[stockIndex].cuts.push(cut);
      cut.done = true;
    } else {
      //console.debug(`Can't fit cut ${cut.id} into stock ${stock.id}. Bailing out...`);
      //console.groupEnd();
      return;
    }

    if (clonedState.cuts.every(c => c.done)) {
      console.info(`Solution: `, addTotalsToSolution(clonedState));
      //console.groupEnd();
      return;

    }

    for (let i = 0; i < clonedState.stock.length; i++) {
      //console.debug(`Calling optimize with: stock index = ${i}`);
      createSolution(clonedState, i);
    }
    //console.groupEnd();
  };

  for (let i = 0; i < state.stock.length; i++) {
    //console.debug(`Calling optimize with: stock index = ${i}`);
    createSolution(state, i);
  }

  return <></>;
}

/*
TODO:
- Handle buying stock where needed

*/