import React from 'react'

function BuyCatalogLine(props){

    return (
        <div>
        <hr style={{border: "2px solid purple"}}></hr>
        <h3>{props.title}</h3>
        <p>Lowest Price: ${props.price}</p>
        <p>ISBN10: {props.isbn10}</p>
        <button type="submit" onClick = {props.handleBuy}>Purchase at ${props.price}</button> 
        </div>
    )
};

export default BuyCatalogLine;
