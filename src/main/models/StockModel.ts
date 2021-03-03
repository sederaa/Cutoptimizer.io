import { CutModel } from "main/models/CutModel";

export class StockModel {
    id!: number;
    instanceId!: number;
    length!: number;
    quantity: number = 1;
    price: number = 0;
    name!: string;
    _remainingLength!: number;
    _remainingQuantity!: number;
    _totalKerf: number = 0;
    _cuts?: CutModel[]; // used at the end to group all cuts into the stock they come from
}
