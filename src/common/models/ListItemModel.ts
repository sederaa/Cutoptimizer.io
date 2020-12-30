import { nameofFactory } from "common/utilities/nameofFactory";

export interface ListItemModel {
    id: number;
    name: string;
    length: number | null;
    quantity: number | null;
}

export const nameofListItemModel = nameofFactory<ListItemModel>();

export const makeEmptyListItemData = (id: number) => ({ id, name: "", length: null, quantity: 1 } as ListItemModel);

export const isEmptyListItemData = (item: ListItemModel) => item.name === "" && item.length === null;
