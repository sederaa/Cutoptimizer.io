import { Node } from "main/services/createSolutionsTree";
import { StockModel } from "main/models/StockModel";

const assignStockPiecesUsed = (node: Node, stockIds: Set<number>) => {
    if (!node._complete) return;
    let nodeStockIds = new Set(stockIds);
    if (node.stock) {
        nodeStockIds.add(node.stock.id);
    }
    node._stockUsed = nodeStockIds.size;
    for (const childNode of node.children) {
        assignStockPiecesUsed(childNode, nodeStockIds);
    }
};

const findLeafNodeWithLowestStockUsed = (node: Node): Node | undefined => {
    let leafNodeWithLowestStockUsed: Node | undefined = undefined;
    const findLeafNodeWithLowestStockUsedInternal = (node2: Node) => {
        if (node2.children?.length === 0) {
            if (
                node2._stockUsed !== undefined &&
                (leafNodeWithLowestStockUsed?._stockUsed === undefined ||
                    node2._stockUsed < leafNodeWithLowestStockUsed._stockUsed)
            ) {
                leafNodeWithLowestStockUsed = node2;
            }
        } else {
            for (const childNode of node2.children) {
                findLeafNodeWithLowestStockUsedInternal(childNode);
            }
        }
    };
    findLeafNodeWithLowestStockUsedInternal(node);
    return leafNodeWithLowestStockUsed;
};

const getNodeLineage = (node: Node): Node[] => {
    if (node.parent === undefined || node.parent.stock === undefined || node.parent.cut === undefined) return [node];
    return [node, ...getNodeLineage(node.parent)];
};

export const findSolutionByLeastStockUsed = (node: Node) => {
    assignStockPiecesUsed(node, new Set());

    let leafNodeWithLowestStockUsed = findLeafNodeWithLowestStockUsed(node);
    if (leafNodeWithLowestStockUsed === undefined) return undefined;

    //console.debug(`leafNodeWithLowestStockUsed = `, leafNodeWithLowestStockUsed);

    const nodes = getNodeLineage(leafNodeWithLowestStockUsed);

    //console.debug(`leafNodeWithLowestStockUsed lineage = `, nodes);

    //TODO: merge nodes for the same stock and return stocks with their cuts inside
    let stocks: StockModel[] = [];
    for (const node of nodes) {
        let index = stocks.findIndex((s) => s.instanceId === node.stock.instanceId);
        if (index > -1) {
            stocks[index]._cuts = [...(stocks[index]._cuts ?? []), node.cut];
        } else {
            stocks.push({ ...node.stock, _cuts: [node.cut] } as StockModel);
        }
    }

    console.debug(`merged stock nodes = `, stocks);
};
