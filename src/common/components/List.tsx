import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { ListMachine, ListEvents, UpdateFieldEvent } from "common/components/ListMachine";
import { ListItemModel } from "common/models/ListItemModel";
import { IntegerField } from "common/components/IntegerField";

interface ListProps {
    onItemsChanged: (items: ListItemModel[]) => void;
}

export const List = ({ onItemsChanged }: ListProps) => {
    const [state, sendEvent] = useMachine(ListMachine, { context: { onItemsChanged } });
    //console.debug(`state.context.items = `, state.context.items);

    const handleAddClick = () => {
        sendEvent(ListEvents.Add);
    };

    const handleDeleteItem = (id: number) => {
        sendEvent({ type: ListEvents.Delete, id });
    };

    const handleUpdateField = (id: number, name: keyof Omit<ListItemModel, "id">, value: string) => {
        sendEvent({
            type: ListEvents.UpdateField,
            id,
            name,
            value,
        } as UpdateFieldEvent);
    };

    return (
        <>
            <ul>
                {state.context.items.map((i) => (
                    <ListItem key={i.id} data={i} handleDeleteItem={handleDeleteItem} handleUpdateField={handleUpdateField} />
                ))}
            </ul>
            <button onClick={handleAddClick}>+ Add</button>
        </>
    );
};

interface ListItemProps {
    data: ListItemModel;
    handleDeleteItem: (id: number) => void;
    handleUpdateField: (id: number, name: keyof Omit<ListItemModel, "id">, value: string) => void;
}

export const ListItem = ({ data, handleDeleteItem, handleUpdateField }: ListItemProps) => {
    return (
        <li>
            {data.id}.
            <input type="text" name="name" value={data.name} onChange={(e) => handleUpdateField(data.id, "name", e.target.value)} placeholder="Name" />
            <IntegerField name="length" placeholder="Length" value={data.length ?? ""} min={1} max={99999} onChange={(value) => handleUpdateField(data.id, "length", value?.toString() ?? "")} />
            <IntegerField name="quantity" placeholder="Quantity" value={data.quantity ?? ""} min={1} max={99999} onChange={(value) => handleUpdateField(data.id, "quantity", value?.toString() ?? "")} />
            <button onClick={() => handleDeleteItem(data.id)}>x</button>
        </li>
    );
};
