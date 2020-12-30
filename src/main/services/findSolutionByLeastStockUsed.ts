import { Node } from "main/services/createSolutionsTree";

export const findSolutionByLeastStockUsed = (node: Node) => {
    for (const childNode of node.children) {
        const childNodeResult = findSolutionByLeastStockUsed(childNode);
        //printTree(childNode, level + 1);
    }
    const result = {} as InterimResult;
};

type InterimResult = {
    count: number;
    nodes: Node[];
};
