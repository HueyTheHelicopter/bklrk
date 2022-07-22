import React from 'react';
import cl from "./Dot_Indicator.module.css";

const Dot_Indicator = ({isActive, setIsActive}) => {

    const rootClasses = [cl.dot_Indicator]

    if (isActive) {
        rootClasses.push(cl.active)
    }

    return (
        <div className={rootClasses.join(' ')} onClick={() => setIsActive(false)}>
            <p>recording</p>
        </div>
    );
};

export default Dot_Indicator;
    ;