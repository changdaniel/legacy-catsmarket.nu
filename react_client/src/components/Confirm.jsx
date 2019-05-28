import React from 'react'


function Confirm(props){

    let title = props.title
    let price = props.price

    if(title == ""){
        title = "Listed via ISBN"
    }
    if(price == ""){
        price = "(80% of internet list price)"
    }


    return (
        <div>
        <h3>Confirm {props.messages.purpose} of: {title}</h3>
        <p>ISBN10: {props.isbn10}</p>
        <p>{props.messages.pricegrammar} ${price}</p>
        Northwestern Email: <input
                            className={`form-control ${!props.isemailvalid ? 'is-invalid' : ''}`}
                            onChange = {props.handleEmailChange} 
                            autoComplete = "on" 
                            type="text" 
                            name="email" 
                            size = "35"/>
        <div className='invalid-feedback'>{props.emailerrormessage}</div>
        <button type="submit" onClick = {props.handleBuySellSubmit} disabled={!props.isemailvalid}>Confirm {props.messages.purpose}</button>
        </div>
    )
};

export default Confirm;
