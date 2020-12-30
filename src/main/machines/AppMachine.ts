import { Machine, assign } from "xstate";
import { createSolutionsTree, Node } from "main/services/createSolutionsTree";
import { printTree } from "main/services/printTree";
import { BuyableStockModel } from "main/models/BuyableStockModel";
import { StockModel } from "main/models/StockModel";
import { CutModel } from "main/models/CutModel";
import merge from "lodash.merge";
import { makeEmptyListItemData, isEmptyListItemData } from "common/models/ListItemModel";

interface AppMachineContext {
    input: Input;
}

interface Input {
    cuts: CutModel[];
    stocks: StockModel[];
    buyableStocks: BuyableStockModel[];
    kerf: number;
}

export enum AppMachineStates {
    Idle = "Idle",
    CheckingReadyForCalculation = "CheckingReadyForCalculation",
    Calculating = "Calculating",
}

interface AppMachineSchema {
    states: {
        [AppMachineStates.Idle]: {};
        [AppMachineStates.CheckingReadyForCalculation]: {};
        [AppMachineStates.Calculating]: {};
    };
}

export enum AppMachineEvents {
    SetKerf = "SetKerf",
    SetCuts = "SetCuts",
    SetStock = "SetStock",
}
export type SetKerfEvent = { type: AppMachineEvents.SetKerf; kerf: number };
export type SetCutsEvent = { type: AppMachineEvents.SetCuts; cuts: CutModel[] };
export type SetStockEvent = { type: AppMachineEvents.SetStock; stock: CutModel[] };
type AppMachineEvent = SetKerfEvent | SetCutsEvent | SetStockEvent;

export const AppMachine = Machine<AppMachineContext, AppMachineSchema, AppMachineEvent>({
    initial: AppMachineStates.Idle,
    context: {
        input: {
            cuts: [makeEmptyListItemData(0)] as CutModel[],
            stocks: [makeEmptyListItemData(0)] as StockModel[],
            buyableStocks: [] as BuyableStockModel[],
            kerf: 0,
        },
    },
    states: {
        [AppMachineStates.Idle]: {
            on: {
                [AppMachineEvents.SetKerf]: {
                    actions: assign({
                        input: (context, event: SetKerfEvent) => merge(context.input, { kerf: event.kerf }),
                    }),
                    target: AppMachineStates.CheckingReadyForCalculation,
                },
                [AppMachineEvents.SetCuts]: {
                    actions: assign({
                        input: (context, event: SetCutsEvent) => merge(context.input, { cuts: event.cuts }),
                    }),
                    target: AppMachineStates.CheckingReadyForCalculation,
                },
                [AppMachineEvents.SetStock]: {
                    actions: assign({
                        input: (context, event: SetStockEvent) => merge(context.input, { stocks: event.stock }),
                    }),
                    target: AppMachineStates.CheckingReadyForCalculation,
                },
            },
        },
        [AppMachineStates.CheckingReadyForCalculation]: {
            always: [
                {
                    cond: (context) =>
                        context.input.cuts.some((c) => !isEmptyListItemData(c)) &&
                        context.input.stocks.some(
                            (c) => !isEmptyListItemData(c)
                        ) /*||
                            context.input.buyableStocks.some((c) => c.id > 0)*/,
                    target: AppMachineStates.Calculating,
                },
                {
                    target: AppMachineStates.Idle,
                },
            ],
        },
        [AppMachineStates.Calculating]: {
            entry: (context) => {
                const treeRootNode = createSolutionsTree(
                    context.input.cuts,
                    context.input.stocks,
                    context.input.buyableStocks,
                    context.input.kerf
                );
                printTree(treeRootNode, 0);
            },
            always: AppMachineStates.Idle,
        },
    },
});
