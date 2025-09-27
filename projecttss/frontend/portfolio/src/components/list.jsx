import React from "react";

function List(props){
    return(
     <a href={`/employee/${props.id}`} ><div className="list-card">
            <h3 className="list-name">{props.name}</h3>
            <p className="list-hour">{props.hour} hours</p>
        </div></a>
    )
}

export default List;