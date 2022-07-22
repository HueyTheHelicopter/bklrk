import React, { useContext } from 'react';
import { UserContext } from "../context";
import MyButton from './UI/button/MyButton';
import PostService from '../API/PostService';

const PresetItem = (props) => {

  const { user } = useContext(UserContext)

  const deletePreset = async () => {
    if (user !== props.preset.p_bearer){
      console.log("preset isn't yours!")
    } else {
      const response = await PostService.deletePreset(props.preset.p_name, props.preset.p_bearer)

      response.status === 200 ? 
      console.log("preset deleted " + response.status)
      : console.log(response)
    }
  }

  const handleEditing = () => {
    if (user !== props.preset.p_bearer) {
      console.log("You can't edit it, " + user)
    }
    else {
      console.log("Ok, you can edit, " + user)
    }
  }

  return (
    <div className="preset">
      <div className="preset__content">
        <strong>
          {'Preset Name: ' + props.preset.p_name}
        </strong>
        <div>
          <strong>
            {'Preset Bearer: ' + props.preset.p_bearer}
          </strong>
        </div>
      </div>
      <div name = "cam_btns" class = "all">
        <MyButton style={{marginRight: '5px'}} name = "cam_btns" class = "prst" onClick={() => deletePreset()}>
          Delete
        </MyButton>
        <MyButton style={{marginRight: '5px'}} name = "cam_btns" class = "prst" onClick={() => handleEditing()}>
          Edit
        </MyButton>
        <MyButton name = "cam_btns" class = "prst" onClick={() => PostService.executePreset(props.preset.p_name)}>
          Execute
        </MyButton>
      </div>
    </div>
  );
};

export default PresetItem;