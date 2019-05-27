import React from 'react'

function ConfirmBuy(props){

    return (
        <div>
        <h3>Confirm purchase of {props.title}</h3>
        <p>ISBN10: {props.isbn10}</p>
        <p>For ${props.price}</p>
        Northwestern Email: <input
                            className={`form-control ${!props.isemailvalid ? 'is-invalid' : ''}`}
                            onChange = {props.handleEmailChange} 
                            autoComplete = "on" 
                            type="text" 
                            name="email" 
                            size = "35"/>
        <div className='invalid-feedback'>{props.emailerrormessage}</div>
        <button type="submit" onClick = {props.handleBuySubmit} disabled={!props.isemailvalid}>Confirm Purchase</button>
        </div>
    )
};

export default ConfirmBuy;
