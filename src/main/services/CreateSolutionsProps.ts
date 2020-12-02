import { BuyableStockModel } from "../models/BuyableStockModel";
import { StockModel } from "../models/StockModel";
import { CutModel } from "../models/CutModel";

export interface CreateSolutionsProps {
    cuts: CutModel[];
    stocks: StockModel[];
    buyableStocks: BuyableStockModel[];
    kerf: number;
}
