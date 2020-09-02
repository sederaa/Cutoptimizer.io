import React from 'react';
import clone from 'rfdc';

export const Algo = () => {

  // Non-obvious solution, where all cuts are taken from 2nd stock piece. trips up most other optimizers.
  let originalState = {
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



  // Pre-condition: All stock & buyablestock must have unique ids

  console.debug(`Starting state: `, originalState);

  const addTotalsToSolution = (stateArg) => {
    stateArg.stock.forEach(s => s.used = s.cuts.reduce((accumulator2, currentValue2) => accumulator2 + currentValue2.len, 0));
    stateArg.stock.forEach(s => s.waste = s.len - s.used);
    stateArg.wasteTotal = stateArg.stock.reduce((accumulator, currentValue) => accumulator + currentValue.waste, 0);
    stateArg.wastePieces = stateArg.stock.reduce((accumulator, currentValue) => accumulator + (currentValue.waste > 0 ? 1 : 0), 0);
    return stateArg;
  }

  const createSolution = (stateArg, stockId) => {
    //console.group(`optimize: stockIndex = ${stockIndex}.`)
    let state = clone()(stateArg);
    //console.debug(`optimize: stateArg = `, clonedState, `, stockIndex = ${stockIndex}.`);
    let cut = state.cuts.find(c => !c.done);

    //console.debug(`Cut to fit: `, cut);
    let stock = state.stock.find(s => s.id === stockId);

    state.path = state.path || "";
    state.path += ` (cut=${cut.id},stock=${stock.id})`;

    if (cut.len <= (stock.len - stock.cuts.reduce((accumulator, currentValue) => accumulator + currentValue.len, 0))) {
      stock.cuts.push(cut);
      cut.done = true;
    } else {
      console.debug(`Can't fit cut ${cut.id} into stock ${stock.id}. Bailing out...`);
      //console.groupEnd();
      return;
    }

    if (state.cuts.every(c => c.done)) {
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