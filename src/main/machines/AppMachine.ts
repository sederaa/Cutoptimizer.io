import { Machine, assign } from "xstate";
import { createSolutionsByTree } from "main/services/createSolutionsTree";
import { BuyableStockModel } from "main/models/BuyableStockModel";
import { StockModel } from "main/models/StockModel";
import { CutModel } from "main/models/CutModel";
import { CreateSolutionsProps } from "main/services/CreateSolutionsProps";
import merge from "lodash.merge";

interface AppMachineContext {
    input: CreateSolutionsProps;
}

export enum AppMachineStates {
    Idle = "Idle",
}

interface AppMachineSchema {
    states: {
        [AppMachineStates.Idle]: {};
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
            cuts: [] as CutModel[],
            stocks: [] as StockModel[],
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
                },
                [AppMachineEvents.SetCuts]: {
                    actions: assign({
                        input: (context, event: SetCutsEvent) => merge(context.input, { cuts: event.cuts }),
                    }),
                },
                [AppMachineEvents.SetStock]: {
                    actions: assign({
                        input: (context, event: SetStockEvent) => merge(context.input, { stocks: event.stock }),
                    }),
                },
            },
        },
    },
});
