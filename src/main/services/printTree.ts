import { Node } from "main/services/createSolutionsTree";

export const printTree = (node: Node, level: number) => {
    const indent = " ".repeat(level * 3);
    console.log(
        `${indent}* NODE#${node?.id} CUT #${node?.cut?.id} (${node?.cut?.name}) STOCK #${node?.stock?.id}/${
            node?.stock?.instanceId
        } (${node?.stock?.name}) (len: ${node?.stock?._remainingLength}/${node?.stock?.length}, qty: ${
            node?.stock?._remainingQuantity
        }/${node?.stock?.quantity}, kerf: ${node?.stock?._totalKerf}) ${node._complete ? "COMPLETE" : ""}`
    );
    for (const childNode of node.children) {
        printTree(childNode, level + 1);
    }
};
