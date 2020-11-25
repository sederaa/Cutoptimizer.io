export interface ListItemModel {
    id: number;
    name: string;
    length: number | null;
    quantity: number | null;
}

export const makeEmptyListItemData = (id: number) => ({ id, name: "", length: null, quantity: 1 } as ListItemModel);
