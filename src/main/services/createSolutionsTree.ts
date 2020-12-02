import { CreateSolutionsProps } from "./CreateSolutionsProps";
import { CutModel } from "../models/CutModel";
import { StockModel } from "../models/StockModel";

export class Solution {
    stock!: StockModel[];
    wasteTotal!: number;
    wastePieces!: number;
    cost!: number;
    _path!: string;
}

class Node {
    segment!: CutModel;
    stock!: StockModel;
    parent?: Node;
    children: Node[] = [];
}

const findStockItemInParents = (node: Node, stockId: number): StockModel | undefined => {
    if (!node?.stock) return undefined;
    if (node.stock.id === stockId) return node.stock;
    if (!node.parent) return undefined;
    return findStockItemInParents(node.parent, stockId);
};

export const createSolutionsByTree = ({ cuts, stocks, buyableStocks, kerf }: CreateSolutionsProps) /*: Solution[]*/ => {
    //console.debug(`createSolutions: cuts = `, cuts, `, stock = `, stock, `, buyableStocks = `, buyableStocks, `, kerf = ${kerf}.`);

    // sort segments by length ascending
    cuts.sort((s1, s2) => (s1.length === s2.length ? 0 : s1.length < s2.length ? 1 : -1));

    stocks = stocks.map(
        (s) =>
            ({
                ...s,
                _remainingLength: s.length,
                _remainingQuantity: s.quantity,
            } as StockModel)
    );
    const buyableStocksTemp = buyableStocks.map(
        (bs) =>
            ({
                ...bs,
                _remainingLength: bs.length,
                _remainingQuantity: Number.POSITIVE_INFINITY,
            } as StockModel)
    );
    Array.prototype.push.apply(stocks, buyableStocksTemp);

    const root = new Node();

    const buildTree = (node: Node, segmentIndex: number) => {
        if (segmentIndex < 0) return;
        const segment = cuts[segmentIndex];
        node.children = node.children ?? [];
        for (const stock of stocks) {
            // get this stock item from further up the chain, otherwise use stock
            const stockItem = findStockItemInParents(node, stock.id);
            // create node if it fits
            let clonedStockItem: StockModel | undefined = undefined;
            if (stockItem && segment.length === stockItem._remainingLength - stockItem._totalKerf) {
                // Case 1: the segment fits the stock remaining length (inc. kerf) exactly
                clonedStockItem = {
                    ...stockItem,
                    _remainingLength: stockItem._remainingLength - segment.length,
                    _totalKerf: stockItem._totalKerf,
                } as StockModel;
            } else if (stockItem && segment.length < stockItem._remainingLength - stockItem._totalKerf) {
                // Case 2: the segment fits the stock remaining length (inc. kerf) with remainder
                clonedStockItem = {
                    ...stockItem,
                    _remainingLength: stockItem._remainingLength - segment.length,
                    _totalKerf: stockItem._totalKerf + kerf,
                } as StockModel;
            } else if (stockItem && stockItem._remainingQuantity > 1 && segment.length === stock.length) {
                // Case 3: the segment doesn't fit the stock remaining length, but there is another stock item we can use and the segment fits exactly
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - segment.length,
                    _remainingQuantity: stockItem._remainingQuantity - 1,
                    _totalKerf: 0,
                } as StockModel;
            } else if (stockItem && stockItem._remainingQuantity > 1 && segment.length === stock.length) {
                // Case 4: the segment doesn't fit the stock remaining length, but there is another stock item we can use and the segment fits with remainder
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - segment.length,
                    _remainingQuantity: stockItem._remainingQuantity - 1,
                    _totalKerf: kerf,
                } as StockModel;
            } else if (!stockItem && segment.length === stock.length) {
                // Case 5: this stock hasn't been used yet, and it fits the first one exactly
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - segment.length,
                    _totalKerf: 0,
                } as StockModel;
            } else if (!stockItem && segment.length <= stock.length) {
                // Case 6: this stock hasn't been used yet, and it fits the first one with remainder
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - segment.length,
                    _totalKerf: kerf,
                } as StockModel;
            }

            if (clonedStockItem) {
                const newNode = {
                    stock: clonedStockItem,
                    segment: segment,
                    parent: node,
                    children: [],
                } as Node;
                node.children.push(newNode);
                buildTree(newNode, segmentIndex - 1);
            }
        }
    };

    buildTree(root, cuts.length - 1);

    const printTree = (node: Node, level: number) => {
        const indent = " ".repeat(level * 3);
        console.log(`${indent}* SEGMENT ${node?.segment?.id} STOCK ${node?.stock?.id} (len: ${node?.stock?._remainingLength}/${node?.stock?.length}, qty: ${node?.stock?._remainingQuantity}/${node?.stock?.quantity}, kerf: ${node?.stock?._totalKerf})`);
        for (const childNode of node.children) {
            printTree(childNode, level + 1);
        }
    };

    console.log(root);

    printTree(root, 0);
};