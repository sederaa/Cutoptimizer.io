import React from 'react';
import styled from 'styled-components';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';

enum ListStates {
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

enum ListEvents {
    Add = "Add",
    Delete = "Delete",
    UpdateField = "UpdateField"
}
type DeleteEvent = {
    type: ListEvents.Delete,
    id: number
}
type UpdateFieldEvent = {
    type: ListEvents.UpdateField,
    id: number,
    name: keyof (Omit<ListItemData, "id">),
    value: string
}
type ListEvent = { type: ListEvents.Add } | DeleteEvent | UpdateFieldEvent;

interface ListItemData {
    id: number,
    name: string,
    length: number,
    quantity: number
}
const makeEmptyListItemData = (id: number) => ({ id, name: "", length: 0, quantity: 1 } as ListItemData);

interface ListContext {
    items: ListItemData[],
}

const ListMachine = Machine<ListContext, ListSchema, ListEvent>({
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
                    cond: (context, event) => context.items.length > 1,
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
                ]
            }),
            always: ListStates.Idle
        },
        [ListStates.Deleting]: {
            entry: [
                assign({
                    items: (context, event) => ([...context.items.filter(i => i.id !== (event as DeleteEvent).id)])
                }),
                assign({ items: (context, event) => (context.items.length > 1 ? context.items : [makeEmptyListItemData(0)]) })
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

export const List = () => {
    const [state, sendEvent] = useMachine(ListMachine);

    const handleAddClick = () => {
        sendEvent(ListEvents.Add);
    }

    const handleDeleteItem = (id: number) => {
        sendEvent({ type: ListEvents.Delete, id });
    }

    const handleUpdateField = (id: number, name: keyof (Omit<ListItemData, "id">), value: string) => {
        sendEvent({ type: ListEvents.UpdateField, id, name, value } as UpdateFieldEvent);
    }

    return <>
        <ul>
            {state.context.items.map(i => <ListItem key={i.id} data={i} handleDeleteItem={handleDeleteItem} handleUpdateField={handleUpdateField} />)}
        </ul>
        <button onClick={handleAddClick}>+ Add</button>
    </>
}

interface ListItemProps {
    data: ListItemData,
    handleDeleteItem: (id: number) => void,
    handleUpdateField: (id: number, name: keyof (Omit<ListItemData, "id">), value: string) => void
}

export const ListItem = ({ data, handleDeleteItem, handleUpdateField }: ListItemProps) => {
    return <li>
        {data.id}.
        <input type="text" name="name" value={data.name} onChange={(e) => handleUpdateField(data.id, "name", e.target.value)} />
        <input type="number" name="length" value={data.length} onChange={(e) => Number.isInteger(Number.parseInt(e.target.value)) ? handleUpdateField(data.id, "length", e.target.value) : null} />
        <input type="number" name="quantity" value={data.quantity} onChange={(e) => Number.isInteger(Number.parseInt(e.target.value)) ? handleUpdateField(data.id, "quantity", e.target.value) : null} />
        <button onClick={() => handleDeleteItem(data.id)}>x</button>
    </li>;
}

// Fix bug: if you try to backspace length or quantity fields until empty, it doesn't work