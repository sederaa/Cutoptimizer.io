export class StockModel {
    id!: number;
    length!: number;
    quantity: number = 1;
    price: number = 0;
    name!: string;
    _remainingLength!: number;
    _remainingQuantity!: number;
    _totalKerf: number = 0;
}
