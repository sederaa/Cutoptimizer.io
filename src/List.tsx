import React from 'react';
import styled from 'styled-components';
import { useMachine } from '@xstate/react';
import { ListMachine, ListEvents, ListItemData, UpdateFieldEvent } from './ListMachine';
import { IntegerField } from './common/components/IntegerField';

export const List = () => {
    const [state, sendEvent] = useMachine(ListMachine);
    //console.debug(`state = `, state);

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
        <IntegerField name="length" value={data.length} min={1} max={99999} onChange={(value) => handleUpdateField(data.id, "length", value.toString())} />
        <IntegerField name="quantity" value={data.quantity} min={1} max={99999} onChange={(value) => handleUpdateField(data.id, "quantity", value.toString())} />
        <button onClick={() => handleDeleteItem(data.id)}>x</button>
    </li>;
}
