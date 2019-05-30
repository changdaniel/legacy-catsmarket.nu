import React from 'react'


function SellByISBN(props){

    return (
        <div>
        List by ISBN10 or ISBN13: <input
                            className={`form-control ${!props.isisbnvalid ? 'is-invalid' : ''}`}
                            onChange = {props.handleISBNChange} 
                            type = "text" 
                            size = "13"/>
        <div className='invalid-feedback'>{props.isbnerrormessage}</div>
        <button class="btn btn-info" type="submit" onClick = {props.handleISBNSubmit} disabled={!props.isisbnvalid}>List</button>
        </div>
    )
};

export default SellByISBN;
