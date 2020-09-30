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
    //_id!: number;
    //_done: boolean = false;
    //_type: "kerf" | "user" = "user";
}

export class Stock {
    id!: number;
    length!: number;
    quantity: number = 1;
    price: number = 0;
    name!: string;
    //_id!: number;
    //_segments: Segment[] = new Array<Segment>();
    //_used!: number;
    //_waste!: number;
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
    _path!: string;
}
/*
class State {
    segments!: Segment[];
    stock!: Stock[];
    _path!: string;
}
*/
class Node {
    segment!: Segment;
    stock!: Stock;
    parent: Node;
    children: Node[] = [];
}

const findStockItemInParents = (node: Node, stockId: number): Stock | undefined => {
    if (!node) return undefined;
    if (node.stock.id === stockId) return node.stock;
    return findStockItemInParents(node.parent, stockId);
}

export const createSolutionsByTree = ({ segments, stock: stocks, buyableStocks, kerf }: CreateSolutionsProps): Solution[] => {
    //console.debug(`createSolutions: segments = `, segments, `, stock = `, stock, `, buyableStocks = `, buyableStocks, `, kerf = ${kerf}.`);

    //TODO: sort segments by length ascending

    const root = new Node();

    const buildTree = (node: Node, segmentIndex: number) => {
        if (segmentIndex < 0) return;
        const segment = segments[segmentIndex];
        node.children = node.children ?? [];
        for (const stock of stocks) {
            // get this stock item from further up the chain, otherwise use stock
            const stockItem = findStockItemInParents(node, stock.id) ?? stock;
            // create node if it fits
            if (segment.length <= stockItem.length) {
                const clonedStockItem = { ...stockItem } as Stock;
                const newNode = { stock: clonedStockItem, segment: segment, parent: node, children: [] } as Node;
                node.children.push(newNode);
                buildTree(newNode, segmentIndex - 1);
            }
        }

        // loop through buyableStocks in the same way as stock
    }

    buildTree(root, segments.length - 1);
}


