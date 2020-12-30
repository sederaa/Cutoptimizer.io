import { Node } from "main/services/createSolutionsTree";

export const printTree = (node: Node, level: number) => {
    const indent = " ".repeat(level * 3);
    console.log(
        `${indent}* CUT ${node?.cut?.id} STOCK ${node?.stock?.id} (len: ${node?.stock?._remainingLength}/${node?.stock?.length}, qty: ${node?.stock?._remainingQuantity}/${node?.stock?.quantity}, kerf: ${node?.stock?._totalKerf})`
    );
    for (const childNode of node.children) {
        printTree(childNode, level + 1);
    }
};
