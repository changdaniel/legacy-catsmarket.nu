import React from 'react'

const searchbox = (props) => {
    

    return (
        <h1> {props.category}
				<select value = {props.selected}
                onChange = {props.handleChange}>
					{props.elements}
				</select>
		</h1>
    )
};

export default searchbox;