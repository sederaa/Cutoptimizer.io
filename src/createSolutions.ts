import React from 'react';
import clone from 'rfdc';

export interface CreateSolutionsProps {
    segments: Segment[],
    stock: Stock[],
    buyableStocks: BuyableStock[],
    kerf: number
}

export class Segment {
    id!: number;
    length!: number;
    quantity: number | undefined = 1;
    name!: string;
    _id!: number;
    _done: boolean = false;
    _type: "kerf" | "user" = "user";
}

export class Stock {
    id!: number;
    length!: number;
    quantity: number = 1;
    price: number = 0;
    name!: string;
    _id!: number;
    _segments: Segment[] = new Array<Segment>();
    _used!: number;
    _waste!: number;
}

export class BuyableStock {
    id!: number;
    length!: number;
    price: number | undefined = 0;
    name!: string;
}

export class Solution {
    stock!: Stock[];
    wasteTotal!: number;
    wastePieces!: number;
    cost!: number;
}

class State {
    segments!: Segment[];
    stock!: Stock[];
}

export const createSolutions = ({ segments, stock, buyableStocks, kerf }: CreateSolutionsProps): Solution[] => {
    //console.debug(`createSolutions: segments = `, segments, `, stock = `, stock, `, buyableStocks = `, buyableStocks, `, kerf = ${kerf}.`);
    let originalState = new State();
    originalState.stock = stock.flatMap(s => Array.from({ length: s.quantity }, () => ({ ...s, _segments: new Array<Segment>() } as Stock))).map((s, i) => ({ ...s, _id: i + 1 }));
    originalState.segments = segments.flatMap(s => Array.from({ length: s.quantity ?? 1 }, () => ({ ...s } as Segment))).map((s, i) => ({ ...s, _id: i + 1 }));

    console.debug(`createSolutions: originalState = `, originalState);

    let solutions = new Array<Solution>();

    const addTotalsToSolution = (stateArg: Stock[]): Solution => {
        let solution = new Solution();
        solution.stock = stateArg;
        solution.stock.forEach(s => s._used = s._segments.reduce((accumulator2, currentValue2) => accumulator2 + currentValue2.length, 0));
        solution.stock.forEach(s => s._waste = s.length - s._used);
        solution.wasteTotal = stateArg.reduce((accumulator, currentValue) => accumulator + currentValue._waste, 0);
        solution.wastePieces = stateArg.reduce((accumulator, currentValue) => accumulator + (currentValue._waste > 0 ? 1 : 0), 0);
        solution.cost = stateArg.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
        return solution;
    }

    const createSolution = (stateArg: State, stockId: number, callCount: number) => {
        if (callCount > originalState.segments.length) {
            throw new Error(`Call count is ${callCount}. Bailing out...`);
            return;
        }

        //console.group(`createSolution: stockId = ${stockId}, callCount = ${callCount}.`)
        let state = clone()(stateArg);
        //console.debug(`createSolution: state = `, state, `, stockId = ${stockId}, segments = `, segments);
        let segment = state.segments.find(c => !c._done);
        if (!segment) {
            const solution = addTotalsToSolution(state.stock);
            solutions.push(solution);
            //console.info(`SOLUTION: `, solution);
            //console.groupEnd();
            return;
        }

        //console.debug(`segment to fit: `, segment);
        let stock = state.stock.find(s => s._id === stockId);
        if (!stock) {
            let buyableStock = buyableStocks.find(s => s.id === stockId);
            if (buyableStock) {
                //console.debug(`Found buyable stock ${buyableStock.id}, cloning and adding to stock...`);
                stock = { ...buyableStock } as Stock;
                stock._id = state.stock.reduce((highest, currentValue) => highest = Math.max(highest, currentValue._id), 0) + 1;
                state.stock.push(stock);
                //console.debug(`added buyable stock with new id = ${stock.id}.`);
            }
        }
        if (!stock) {
            throw new Error(`Couldn't find stock for id ${stockId}`);
        }

        //state.path = state.path || "";
        //state.path += ` (segment=${segment.id},stock=${stock.id})`;
        let segmentLength = segment.length;
        if (segmentLength <= (stock.length - stock._segments.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0))) {
            //console.debug(`segment fits stock, adding segment to stock.segments list and setting done...`);
            stock._segments.push(segment);
            segment._done = true;
            if (kerf > 0 && stock.length > stock._segments.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0)) {
                stock._segments.push({ id: -1, _type: "kerf", length: kerf } as Segment);
            }

        } else if (buyableStocks.some(bs => bs.length >= segmentLength)) {
            //console.debug(`Can't fit segment ${segment._id} into stock ${stock._id}, but there is buyable stock that would fit.`);
            for (const buyableStock of buyableStocks.filter(bs => bs.length >= segmentLength)) {
                //console.debug(`Would call createSolution with id ${buyableStock.id}. state = `, state);
                createSolution(state, buyableStock.id, callCount + 1);
            }
            return;

        } else {
            //console.debug(`Can't fit segment ${segment._id} into stock ${stock._id}. Bailing out...`);
            //console.groupEnd();
            return;
        }

        let segmentsAllAllocated = state.segments.every(s => s._done);
        if (segmentsAllAllocated) {
            const solution = addTotalsToSolution(state.stock);
            solutions.push(solution);
            //console.info(`SOLUTION: `, solution);
            //console.groupEnd();
            return;
        } else {
            for (const stock of state.stock) {
                //console.debug(`Calling createSolution with: stock._id = ${stock._id}`);
                createSolution(state, stock._id, callCount + 1);
            }
        }
        //console.groupEnd();
    };

    for (const stock of originalState.stock) {
        //console.debug(`Calling optimize with: stock._id ${stock._id}`);
        createSolution(originalState, stock._id, 1);
    }

    return solutions;
}