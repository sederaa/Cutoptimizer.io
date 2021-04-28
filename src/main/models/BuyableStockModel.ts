import * as yup from "yup";

export class BuyableStockModel {
    id!: number;
    length!: number;
    price: number | undefined = 0;
    name!: string;
}

export const BuyableStockModelValidationSchema: yup.SchemaOf<BuyableStockModel> = yup.object().shape({
    id: yup.number().typeError("must be number").required("is required"),
    //instanceId: yup.number().typeError("must be number").required("is required"),
    length: yup.number().typeError("must be number").required("is required"),
    //quantity: yup.number().typeError("must be number").required("is required"),
    price: yup.number().typeError("must be number").required("is required"),
    name: yup.string().typeError("must be string").required("is required"),
});
