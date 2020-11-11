import { Machine, assign } from 'xstate';

export enum ListStates {
    Idle = "Idle",
    Deleting = "Deleting",
    Adding = "Adding",
    UpdatingField = "UpdatingField"
}

interface ListSchema {
    states: {
        [ListStates.Idle]: {},
        [ListStates.Deleting]: {},
        [ListStates.Adding]: {},
        [ListStates.UpdatingField]: {},
    }
}

export enum ListEvents {
    Add = "Add",
    Delete = "Delete",
    UpdateField = "UpdateField"
}
type DeleteEvent = {
    type: ListEvents.Delete,
    id: number
}
export type UpdateFieldEvent = {
    type: ListEvents.UpdateField,
    id: number,
    name: keyof (Omit<ListItemData, "id">),
    value: string
}
type ListEvent = { type: ListEvents.Add } | DeleteEvent | UpdateFieldEvent;

export interface ListItemData {
    id: number,
    name: string,
    length: number | "",
    quantity: number | ""
}
const makeEmptyListItemData = (id: number) => ({ id, name: "", length: "", quantity: 1 } as ListItemData);

interface ListContext {
    items: ListItemData[],
}

export const ListMachine = Machine<ListContext, ListSchema, ListEvent>({
    initial: ListStates.Idle,
    context: {
        items: [makeEmptyListItemData(0)]
    },
    states: {
        [ListStates.Idle]: {
            on: {
                [ListEvents.Add]: {
                    target: ListStates.Adding,
                },
                [ListEvents.Delete]: {
                    target: ListStates.Deleting,
                },
                [ListEvents.UpdateField]: {
                    target: ListStates.UpdatingField
                }
            }
        },
        [ListStates.UpdatingField]: {
            entry: assign({
                items: (context, event: UpdateFieldEvent) => [
                    ...context.items.filter(i => i.id !== event.id),
                    ({ ...context.items.find(i => i.id === event.id), [event.name]: event.value } as ListItemData)
                ].sort(i => i.id)
            }),
            always: ListStates.Idle
        },
        [ListStates.Deleting]: {
            entry: [
                assign({
                    items: (context, event) => ([...context.items.filter(i => i.id !== (event as DeleteEvent).id)])
                }),
                assign({ items: (context, event) => (context.items.length > 0 ? context.items : [makeEmptyListItemData(0)]) })
            ],
            always: ListStates.Idle
        },
        [ListStates.Adding]: {
            entry: assign({
                items: (context, event) => {
                    const highestExistingId = context.items.reduce((highestId, currentValue) => currentValue.id > highestId ? currentValue.id : highestId, 0);
                    const result = [...context.items, makeEmptyListItemData(highestExistingId + 1)];
                    return result;
                }
            }),
            always: ListStates.Idle
        },
    }
})
