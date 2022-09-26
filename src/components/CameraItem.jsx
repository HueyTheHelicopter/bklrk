import React, { useContext } from 'react';
import MyButton from './UI/button/MyButton';
import { useNavigate } from "react-router-dom";
import { RecContext } from '../context';
import Stream from './UI/Stream/Stream';

const CameraItem = (props) => {

  const state = {
    id: props.camera.id,
    loc: props.camera.location,
    status: props.camera.status,
    name: props.camera.name,
    ip: props.camera.ip_address,
  }


  const navigate = useNavigate()

  return (
    <div className="camera">
      <div className="camera__content">
        <strong style={{fontSize: 20, color: 'black'}}>
          {props.camera.location}
          {' | '}
          {"status: "}{props.camera.status}
        </strong>
        {/* <div>
          <Stream camera={state} location={props.camera.id}/>
        </div> */}
      </div>
      <div name = "cam_btns" class = "all">
        <MyButton name = "cam_btns" class = "opn" onClick={() => navigate("/dashboard/" + props.camera.id, {state})}>
          open
        </MyButton>
      </div>
    </div>
  );
};

export default CameraItem;