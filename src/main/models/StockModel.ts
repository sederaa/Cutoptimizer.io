import { CutModel } from "main/models/CutModel";
import * as yup from "yup";

export interface StockModel {
    id: number;
    instanceId: number;
    length: number;
    quantity: number;
    price: number;
    name: string;
    _remainingLength?: number;
    _remainingQuantity?: number;
    _totalKerf?: number;
    _cuts?: CutModel[]; // used at the end to group all cuts into the stock they come from
}

export const StockModelValidationSchema: yup.SchemaOf<StockModel> = yup.object().shape({
    id: yup.number().typeError("must be number").required("is required"),
    instanceId: yup.number().typeError("must be number").required("is required"),
    length: yup.number().typeError("must be number").required("is required"),
    quantity: yup.number().typeError("must be number").required("is required"),
    price: yup.number().typeError("must be number").required("is required"),
    name: yup.string().typeError("must be string").required("is required"),
    _remainingQuantity: yup.number().optional(),
    _remainingLength: yup.number().optional(),
    _totalKerf: yup.number().optional(),
    _cuts: yup.array().optional(),
});
