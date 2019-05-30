
import React from 'react'


function EmptyBuyCatalog(props){

    if(props.catalog_length == 0){
    
    return (
    <div class="alert alert-dismissible alert-danger">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    <strong>Oh snap!</strong> <a href="#" class="alert-link">No books were found for this course.</a> Search again or try submitting your own!
    </div>
    )
    }
    else{return null;}
};

export default EmptyBuyCatalog;





