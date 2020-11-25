import { Machine, assign } from "xstate";
import { createSolutionsByTree, CreateSolutionsProps, Segment, Stock, BuyableStock } from "main/services/createSolutionsTree";
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
export type SetCutsEvent = { type: AppMachineEvents.SetCuts; cuts: Segment[] };
type AppMachineEvent = SetKerfEvent | SetCutsEvent;

export const AppMachine = Machine<AppMachineContext, AppMachineSchema, AppMachineEvent>({
    initial: AppMachineStates.Idle,
    context: {
        input: {
            segments: [] as Segment[],
            stocks: [] as Stock[],
            buyableStocks: [] as BuyableStock[],
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
