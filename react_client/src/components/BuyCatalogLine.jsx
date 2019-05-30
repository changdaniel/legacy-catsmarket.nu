import React from 'react'


function BuyCatalogLine(props){


    const currentprice = props.price;

    return (
        <div>
        <hr style={{border: "2px solid purple"}}></hr>
        <h3>{props.title}</h3>
        <p>Lowest Price: ${(currentprice/100).toFixed(2)}</p>
        <p>ISBN10: {props.isbn10}</p>
        <button type="submit" class="btn btn-info" onClick = {props.handleBuy}>Purchase at ${(currentprice/100).toFixed(2)}</button> 
        </div>
    )
};

export default BuyCatalogLine;
