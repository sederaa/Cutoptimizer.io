import React from 'react';
import styled from 'styled-components';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import {ListMachine, ListEvents, ListItemData, UpdateFieldEvent} from './ListMachine';

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
