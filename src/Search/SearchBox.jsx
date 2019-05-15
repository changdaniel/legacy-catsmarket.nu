import React from 'react'

const searchbox = (props) => {
    

    return (
        <h1> {props.category}
                <form onSubmit = {props.handleSubmit}>
				<select value = {props.selected}
                        onChange = {props.handleChange}>
					{props.elements}
				</select>
				<input type = 'submit' value = "Submit"/>
				</form>
		</h1>
    )
};

export default searchbox;