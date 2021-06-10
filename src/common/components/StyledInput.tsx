import styled from "styled-components";

export const StyledInput = styled.input`
    margin-right: 0.7em;
    border-radius: 3px;
    border: solid 1px dimgray;
    background-color: white;

    &:first-child {
        margin-left: 0;
    }

    &:focus {
        border-color: ${(props) => props.theme.colors.dark};
        outline: solid 1px ${(props) => props.theme.colors.dark};
    }

    & ~ label {
        position: absolute;
        transform-origin: 0 50%;
        transition: transform 200ms, color 200ms;
        left: 8px;
        top: -2px;
        pointer-events: none;
    }

    &:focus ~ label,
    &:not(:placeholder-shown) ~ label {
        background-color: ${(props) => props.theme.colors.dark};
        border-radius: 3px;
        padding: 0.1em 1em;
        color: white;
        font-size: small;
        transform: translateY(-16px) translateX(10px) scale(0.75);
    }

    &:not(:placeholder-shown) ~ label {
        background-color: dimgray;
    }

    &:focus ~ label {
        background-color: ${(props) => props.theme.colors.dark};
    }
`;
