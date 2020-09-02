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

export const createSolutions = ({ segments, stock, buyableStocks, kerf }: CreateSolutionsProps): Solution[] => {
    let originalState = stock.flatMap(s => new Array(s.quantity).map(_ => s));
    originalState.forEach((value, index) => value._id = index+1);
    let workingSegments = segments.flatMap(s => new Array(s.quantity).map(_ => s));
    workingSegments.forEach((value, index) => value._id = index+1);

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

    const createSolution = (stateArg: Stock[], stockId: number) => {
        //console.group(`optimize: stockId = ${stockId}.`)
        let state = clone()(stateArg);
        //console.debug(`optimize: stateArg = `, state, `, stockId = ${stockId}.`);
        //log(state,`createSolution: start.`);
        //log(state,`stockId = ${stockId}.`);
        let segment = workingSegments.find(c => !c._done);
        if (!segment) {
            const solution = addTotalsToSolution(state);
            solutions.push(solution);
            console.info(`Solution: `, solution);
            //console.groupEnd();
            return;
        }

        //log(state,`segmentId = ${segment.id} (len = ${segment.len}, done = ${segment.done}).`);
        //console.debug(`segment to fit: `, segment);
        let stock = state.find(s => s._id === stockId);
        if (!stock) {
            let buyableStock = buyableStocks.find(s => s.id === stockId);
            if (buyableStock) {
                //console.debug(`Found buyable stock ${buyableStock.id}, cloning and adding to stock...`);
                stock = { ...buyableStock } as Stock;
                stock._id = state.reduce((highest, currentValue) => highest = Math.max(highest, currentValue._id), 0) + 1;
                state.push(stock);
                //log(state,`added buyable stock with new id = ${stock.id}.`);
            }
            //log(state,`stock.id = ${stock.id} (len = ${stock.len}).`);
        }
        if (!stock) {
            throw new Error(`Couldn't find stock for id ${stockId}`);
        }

        //state.path = state.path || "";
        //state.path += ` (segment=${segment.id},stock=${stock.id})`;
        let segmentLength = segment.length;
        if (segmentLength <= (stock.length - workingSegments.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0))) {
            //log(state,`segment fits stock, adding segment to stock.segments list and setting done...`);
            stock._segments.push(segment);
            segment._done = true;
            if (kerf > 0 && stock.length > stock._segments.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0)) {
                stock._segments.push({ id: -1, _type: "kerf", length: kerf } as Segment);
            }

        } else if (buyableStocks.some(bs => bs.length >= segmentLength)) {
            //console.debug(`Can't fit segment ${segment.id} into stock ${stock.id}, but there is buyable stock that would fit.`);
            //log(state,`segment doesn't fit stock, but fits some buyable stock, looping through buyable stock...`);
            for (const buyableStock of buyableStocks.filter(bs => bs.length >= segmentLength)) {
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

        for (const stock of state) {
            //console.debug(`Calling optimize with: stock.id = ${stock.id}`);
            createSolution(state, stock._id);
        }
        //console.groupEnd();
    };

    for (const stock of originalState) {
        //console.debug(`Calling optimize with: stock.id ${stock.id}`);
        createSolution(originalState, stock._id);
    }

    return solutions;
}