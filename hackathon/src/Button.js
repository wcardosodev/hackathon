import React from 'react';

const LoadButton = (props) => {

    return(
        <button
            className={props.class}
            onClick={props.fn}
        >
            <span>{props.text}</span>
        </button>
    )
}

export { LoadButton }