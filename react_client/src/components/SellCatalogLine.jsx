import React from 'react'

function SellCatalogLine(props){

    const currentprice = props.price
    const cheaperprice = currentprice - 100;

    return (
        <div>
		<hr style={{border: "2px solid purple"}}></hr>
        <h3>{props.title}</h3>
        <p>Lowest Price: ${currentprice}</p>
        <p>ISBN10: {props.isbn10}</p>
        <button type="submit" onClick = {props.handleSell(props.title, props.isbn10, currentprice)}>List item at ${currentprice} </button>
        <button type="submit" onClick = {props.handleSell(props.title, props.isbn10, cheaperprice)}>List item at ${cheaperprice} </button> 
        </div>
    )
};

export default SellCatalogLine;
