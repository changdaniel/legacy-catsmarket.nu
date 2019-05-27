import React from 'react'

function ListSelect(props){

    const elements = props.elements;
    const listElements = elements.map((element) =>
    <option key = {element.symbol}>
        {element.symbol}
    </option>
    );
    return (
        <h3>{props.category}
            <select 
            value = {props.selected}
            onChange = {props.handleChange}>
            <option defaultValue> 
            </option>
                {listElements}
            </select> 
        </h3>
    )
};

export default ListSelect;
