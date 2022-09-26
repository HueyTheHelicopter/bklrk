import React, { useContext } from 'react';
import cl from './PresetItem.module.css';
import { UserContext, RefetchContext } from "../../../context";
import MyButton from '../button/MyButton';
import PostService from '../../../API/PostService';

const PresetItem = ({children, setPreset, pres}) => {

  const { user } = useContext(UserContext)
  const { setRefetch } = useContext(RefetchContext)

  const deletePreset = async () => {
    if (user !== children.p_bearer){
      console.log("preset isn't yours! " + user)
    } else {
      const response = await PostService.deletePreset(children.p_id)

      response.status === 200 ? 
        setRefetch(true)
        : console.log(response)
    }
  }

  const handleEditing = () => {
    if (user !== children.p_bearer) {
      console.log("You can't edit it, " + user)
    }
    else if (pres.moves.length === 0 && pres.p_id === null){
      console.log("Ok, you can edit, " + user)
      setPreset({moves: children.moveset, p_id: children.id})
    } else {
      setPreset({moves: [], p_id: null})
    }
  }

  return (
    <div className={cl.preset}>
      <div className={cl.preset_content}>
        <strong>
          {'Preset Name: ' + children.p_name}
        </strong>
        <div>
          <strong>
            {'Preset Bearer: ' + children.p_bearer}
          </strong>
        </div>
      </div>
      <div className={cl.preset_buttons}>
        <MyButton style={{marginRight: '5px'}} name = "cam_btns" class = "prst" onClick={() => deletePreset()}>
          Delete
        </MyButton>
        <MyButton style={{marginRight: '5px'}} name = "cam_btns" class = "prst" onClick={() => handleEditing()}>
          Edit
        </MyButton>
        <MyButton name = "cam_btns" class = "prst" onClick={() => PostService.executePreset(children.p_id)}>
          Execute
        </MyButton>
      </div>
    </div>
  );
};

export default PresetItem;