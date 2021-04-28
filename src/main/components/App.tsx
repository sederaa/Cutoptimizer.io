import React from "react";
import "sanitize.css";
import "sanitize.css/forms.css";
import "sanitize.css/typography.css";
import { Header } from "main/components/Header";
import { Tagline } from "main/components/Tagline";
import { InputSection } from "main/components/InputSection";
import { CutList } from "main/components/CutList";
import styled from "styled-components";
import { BuyableStockModel } from "main/models/BuyableStockModel";
import { StockModel } from "main/models/StockModel";
import { CutModel } from "main/models/CutModel";
import { useMachine } from "@xstate/react";
import { AppMachine, AppMachineEvents, SetKerfEvent, SetCutsEvent, SetStockEvent } from "main/machines/AppMachine";

const StyledApp = styled.div``;

const App = () => {
    const [machineState, sendMachineEvent] = useMachine(AppMachine);
    console.debug(`App: machineState.value = `, machineState.value);
    console.debug(`App: machineState.context.input = `, machineState.context.input);
    console.debug(`App: machineState.context.error = `, machineState.context.error);

    const handleKerfChanged = (kerf: number) => {
        sendMachineEvent({ type: AppMachineEvents.SetKerf, kerf } as SetKerfEvent);
    };

    const handleCutsChanged = (cuts: CutModel[]) => {
        //console.debug(`App: handleCutsChanged: cuts = `, cuts);
        sendMachineEvent({ type: AppMachineEvents.SetCuts, cuts } as SetCutsEvent);
    };

    const handleStockChanged = (stock: StockModel[]) => {
        //console.debug(`App: handleStockChanged: stock = `, stock);
        sendMachineEvent({ type: AppMachineEvents.SetStock, stock } as SetStockEvent);
    };

    return (
        <StyledApp>
            <Header />
            <Tagline />
            <InputSection
                kerf={machineState.context.input.kerf}
                onKerfChanged={handleKerfChanged}
                cuts={machineState.context.input.cuts}
                onCutsChanged={handleCutsChanged}
                stock={machineState.context.input.stocks}
                onStockChanged={handleStockChanged}
            />
            <CutList solution={machineState.context.solution} />
        </StyledApp>
    );
};

export default App;

// Non-obvious solution, where all segments are taken from 2nd stock piece. trips up most other optimizers.
// let originalState = {
//   segments: [
//     { id: 0, len: 16, done: false },
//     { id: 1, len: 16, done: false },
//     { id: 2, len: 16, done: false },
//     { id: 3, len: 16, done: false }
//   ],
//   stock: [
//     { id: 0, len: 63, segments: [] },
//     { id: 1, len: 64, segments: [] }
//   ]
// };
/*
    let props = {
        segments: [
            { id: 1, length: 5, quantity: 1 } as Segment,
            { id: 2, length: 10, quantity: 1 } as Segment,
            / *
      { id: 3, length: 10, quantity: 1 } as Segment,
      { id: 4, length: 5, quantity: 1 } as Segment,
      { id: 5, length: 5, quantity: 2 } as Segment,
      * /
        ],
        stocks: [
            { id: 1, length: 10, price: 0, quantity: 5 } as Stock,
            //{ id: 2, length: 10, price: 0, quantity: 1 } as Stock,
            { id: 3, length: 20, price: 0, quantity: 1 } as Stock,
        ],
        buyableStocks: [
            { id: 1001, length: 15, price: 1.23 } as BuyableStock,
            //{ id: 1002, length: 20, price: 2.34 } as BuyableStock,
        ],
        kerf: 1,
    } as CreateSolutionsProps;
*/
//const solutions = createSolutionsByTree(props);
//console.debug(`SOLUTIONS: `, solutions);

//solutions.forEach(s=>console.debug(s._path));
