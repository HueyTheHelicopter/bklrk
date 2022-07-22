import React from 'react';
import cl from './Stream.module.css';

const Stream = (props) => {

    function urlStream(){
        const source = "http://127.0.0.1:5000/api/camera/" + props.location.state.id + "/stream"
        return source
    }

    return (
        <div>
            <div className={cl.WindowName}>
                <h1 style = {{justifyContent: "center", position: 'absolute', top: 70, fontFamily: 'Roboto', fontSize: 36, color: '#C4C4C4'}}>
                    <strong>{props.location.state.loc}</strong>
                </h1>
            </div>
            <div className={cl.StreamWindow}>
                <img src = {urlStream()} alt = {props.location.state}></img>
            </div>
        </div>
    );
};

export default Stream;