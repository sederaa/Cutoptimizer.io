import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { ListMachine, ListEvents, UpdateFieldEvent, AddEvent, DeleteEvent } from "common/components/ListMachine";
import { ListItemModel } from "common/models/ListItemModel";
import { IntegerField } from "common/components/IntegerField";
import constants from "constants.json";

interface ListProps {
    items: ListItemModel[];
    onItemsChanged: (items: ListItemModel[]) => void;
    errors?: Array<{ [Property in keyof ListItemModel]: string | undefined }>;
}

export const List = ({ items, onItemsChanged, errors }: ListProps) => {
    const [state, sendEvent] = useMachine(ListMachine, { context: { onItemsChanged } });
    //console.debug(`state.context.items = `, state.context.items);

    const handleAddClick = () => {
        sendEvent({ type: ListEvents.Add, items } as AddEvent);
    };

    const handleDeleteItem = (id: number) => {
        sendEvent({ type: ListEvents.Delete, items, id } as DeleteEvent);
    };

    const handleUpdateField = (id: number, name: keyof Omit<ListItemModel, "id">, value: string) => {
        sendEvent({
            type: ListEvents.UpdateField,
            id,
            name,
            value,
            items,
        } as UpdateFieldEvent);
    };

    return (
        <>
            <ul>
                {items.map((item, index) => (
                    <ListItem
                        key={item.id}
                        data={item}
                        handleDeleteItem={handleDeleteItem}
                        handleUpdateField={handleUpdateField}
                        errors={errors?.[index]}
                    />
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
    errors: { [Property in keyof ListItemModel]: string | undefined } | undefined;
}

export const ListItem = ({ data, handleDeleteItem, handleUpdateField, errors }: ListItemProps) => {
    return (
        <li>
            {data.id}.
            <input
                type="text"
                name="name"
                value={data.name}
                onChange={(e) => handleUpdateField(data.id, "name", e.target.value)}
                placeholder="Name"
                maxLength={constants.Entities.ListItem.Name.Maxlength}
                style={errors?.["name"] ? { borderColor: "red" } : undefined}
            />
            <IntegerField
                name="length"
                placeholder="Length"
                value={data.length ?? ""}
                min={constants.Entities.ListItem.Length.Min}
                max={constants.Entities.ListItem.Length.Max}
                error={errors?.["length"]}
                onChange={(value) => handleUpdateField(data.id, "length", value?.toString() ?? "")}
            />
            <IntegerField
                name="quantity"
                placeholder="Quantity"
                value={data.quantity ?? ""}
                min={constants.Entities.ListItem.Quantity.Min}
                max={constants.Entities.ListItem.Quantity.Max}
                error={errors?.["quantity"]}
                onChange={(value) => handleUpdateField(data.id, "quantity", value?.toString() ?? "")}
            />
            <button onClick={() => handleDeleteItem(data.id)}>x</button>
        </li>
    );
};
