import React from 'react'

function ListSelectCourses(props){

    const elements = props.elements;
    const listElements = [...elements].map((element) =>
    <option key = {element.catalog_num}>
        {element.catalog_num}
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

export default ListSelectCourses;
