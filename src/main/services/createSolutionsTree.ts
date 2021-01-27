import { CutModel } from "../models/CutModel";
import { StockModel } from "../models/StockModel";
import { BuyableStockModel } from "../models/BuyableStockModel";
import range from "lodash.range";

export class Solution {
    stock!: StockModel[];
    wasteTotal!: number;
    wastePieces!: number;
    cost!: number;
}

export class Node {
    cut!: CutModel;
    stock!: StockModel;
    parent?: Node;
    children: Node[] = [];
    _stockUsed?: number;
    _complete: boolean = false;
}

const findStockItemInParents = (node: Node, stockId: number): StockModel | undefined => {
    if (!node?.stock) return undefined;
    if (node.stock.id === stockId) return node.stock;
    if (!node.parent) return undefined;
    return findStockItemInParents(node.parent, stockId);
};

export const createSolutionsTree = (
    cuts: CutModel[],
    stocks: StockModel[],
    buyableStocks: BuyableStockModel[],
    kerf: number
): Node => {
    //console.debug(        `createSolutionsTree: cuts = `,        cuts,        `, stock = `,        stocks,        `, buyableStocks = `,        buyableStocks,        `, kerf = ${kerf}.`    );

    let expandedCuts = cuts.flatMap((c) => range(1, (c.quantity ?? 1) + 1).map((i) => ({ ...c, id: c.id + i / 100 })));
    //console.debug(`createSolutionsTree: expandedCuts = `, expandedCuts);
    // sort cuts by length ascending
    expandedCuts.sort((s1, s2) => (s1.length === s2.length ? 0 : s1.length < s2.length ? 1 : -1));

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

    const buildTree = (node: Node, cutIndex: number): boolean => {
        //console.debug(`buildTree: cutIndex = ${cutIndex}.`);
        if (cutIndex < 0) return true;
        const cut = expandedCuts[cutIndex];
        node.children = node.children ?? [];
        let completed: boolean = false;

        for (const stock of stocks) {
            // get this stock item from further up the chain, otherwise use stock
            const stockItem = findStockItemInParents(node, stock.id);
            //console.debug(                `buildTree [cutIndex=${cutIndex},stock=${stock.id}]: cut.length = ${cut.length}, stockItem._remainingLength = ${stockItem?._remainingLength}, stockItem._totalKerf = ${stockItem?._totalKerf}, stockItem._remainingQuantity = ${stockItem?._remainingQuantity}, stock.length = ${stock.length}, stockItem = `,                stockItem,                `, cut = `,                 cut            );
            // create node if it fits
            let clonedStockItem: StockModel | undefined = undefined;
            if (stockItem && cut.length === stockItem._remainingLength - stockItem._totalKerf) {
                //console.debug(`buildTree [cutIndex=${cutIndex},stock=${stock.id}]: case 1.`);
                // Case 1: the segment fits the stock remaining length (inc. kerf) exactly
                clonedStockItem = {
                    ...stockItem,
                    _remainingLength: stockItem._remainingLength - cut.length,
                    _totalKerf: stockItem._totalKerf,
                } as StockModel;
            } else if (stockItem && cut.length < stockItem._remainingLength - stockItem._totalKerf) {
                //console.debug(`buildTree [cutIndex=${cutIndex},stock=${stock.id}]: case 2.`);
                // Case 2: the segment fits the stock remaining length (inc. kerf) with remainder
                clonedStockItem = {
                    ...stockItem,
                    _remainingLength: stockItem._remainingLength - cut.length,
                    _totalKerf: stockItem._totalKerf + kerf,
                } as StockModel;
            } else if (stockItem && stockItem._remainingQuantity > 1 && cut.length === stock.length) {
                //console.debug(`buildTree [cutIndex=${cutIndex},stock=${stock.id}]: case 3.`);
                // Case 3: the segment doesn't fit the stock remaining length, but there is another stock item we can use and the segment fits exactly
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - cut.length,
                    _remainingQuantity: stockItem._remainingQuantity - 1,
                    _totalKerf: 0,
                } as StockModel;
            } else if (stockItem && stockItem._remainingQuantity > 1 && cut.length === stock.length) {
                //console.debug(`buildTree [cutIndex=${cutIndex},stock=${stock.id}]: case 4.`);
                // Case 4: the segment doesn't fit the stock remaining length, but there is another stock item we can use and the segment fits with remainder
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - cut.length,
                    _remainingQuantity: stockItem._remainingQuantity - 1,
                    _totalKerf: kerf,
                } as StockModel;
            } else if (!stockItem && cut.length === stock.length) {
                //console.debug(`buildTree [cutIndex=${cutIndex},stock=${stock.id}]: case 5.`);
                // Case 5: this stock hasn't been used yet, and it fits the first one exactly
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - cut.length,
                    _totalKerf: 0,
                } as StockModel;
            } else if (!stockItem && cut.length <= stock.length) {
                //console.debug(`buildTree [cutIndex=${cutIndex},stock=${stock.id}]: case 6.`);
                // Case 6: this stock hasn't been used yet, and it fits the first one with remainder
                clonedStockItem = {
                    ...stock,
                    _remainingLength: stock._remainingLength - cut.length,
                    _totalKerf: kerf,
                } as StockModel;
            } else {
                console.error(`buildTree [cutIndex=${cutIndex},stock=${stock.id}]: no fit.`);
            }

            if (clonedStockItem) {
                const newNode = {
                    stock: clonedStockItem,
                    cut: cut,
                    parent: node,
                    children: [],
                    _complete: cutIndex === 0,
                } as Node;
                node.children.push(newNode);
                let result = buildTree(newNode, cutIndex - 1);
                node._complete = result;
                completed = result ? true : completed;
            }
        }
        return completed;
    };

    const weedOutIncompleteSolutions = () => {
        //TODO
    };

    buildTree(root, expandedCuts.length - 1);
    weedOutIncompleteSolutions();
    return root;
};
