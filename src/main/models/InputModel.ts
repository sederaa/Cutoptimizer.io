import { BuyableStockModel, BuyableStockModelValidationSchema } from "main/models/BuyableStockModel";
import { StockModel, StockModelValidationSchema } from "main/models/StockModel";
import { CutModel, CutModelValidationSchema } from "main/models/CutModel";
import * as yup from "yup";

export interface InputModel {
    cuts: CutModel[];
    stocks: StockModel[];
    buyableStocks: BuyableStockModel[];
    kerf: number;
}

export const InputModelValidationSchema: yup.SchemaOf<InputModel> = yup.object().shape({
    kerf: yup.number().typeError("must be number").required("is required"),
    cuts: yup
        .array()
        .typeError("must be array")
        .required("is required")
        .of(CutModelValidationSchema)
        .min(1, "must have at least one cut"),
    stocks: yup
        .array()
        .typeError("must be array")
        .required("is required")
        .of(StockModelValidationSchema)
        .min(1, "must have at least one stock"),
    buyableStocks: yup.array().typeError("must be array").required("is required").of(BuyableStockModelValidationSchema),
});
