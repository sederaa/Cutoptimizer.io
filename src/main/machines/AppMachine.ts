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
}
export type SetKerfEvent = { type: AppMachineEvents.SetKerf; kerf: number };
export type SetCutsEvent = { type: AppMachineEvents.SetCuts; cuts: CutModel[] };
type AppMachineEvent = SetKerfEvent | SetCutsEvent;

export const AppMachine = Machine<AppMachineContext, AppMachineSchema, AppMachineEvent>({
    initial: AppMachineStates.Idle,
    context: {
        input: {
            segments: [] as CutModel[],
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
                        input: (context, event: SetCutsEvent) => merge(context.input, { segments: event.cuts }),
                    }),
                },
            },
        },
    },
});
