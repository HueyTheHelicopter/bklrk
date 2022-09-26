import React, {useState, useContext} from 'react';
import PresetItem from './UI/PresetItem/PresetItem';
import MyButton from './UI/button/MyButton';
import PostService from '../API/PostService';
import MyModal from './UI/MyModal/MyModal';
import MyInput from './UI/input/MyInput';
import DropdownMenu from './UI/Dropdown/Dropdown';
import { RecContext, UserContext } from '../context';

const PresetList = ({presets, title}) => {

    const { setIsRec } = useContext(RecContext)
    const { user } = useContext(UserContext)
    const [show, setShow] = useState({moves: [], p_id: null});

    const [presetName, setPresetName] = useState({
        value: ''
    })

    const [modal, setModal] = useState(false)

    const newPreset = async () => {
        try {
            const props = {
                "p_name": presetName.value,
                "p_bearer": user
            }

            const response = await PostService.presetNameCheck(props)
            const rresponse = await PostService.allCamsHome()

            if (response.status === 200 && rresponse.status === 200) {
                setIsRec(true)
                sessionStorage.setItem('p_name', presetName.value)
            } 
            else if (response.status === 422) {
                alert("зміни ім'я")
            } 
            else {
                alert(response.msg, response.status)
            }
        } catch (e) { return (e) }
    }

    return (
        <div className="App"> 
            <h1 style={{textAlign: 'center', fontStyle: 'Roboto'}}>
                {title}
            </h1>
            {presets &&
             presets
             .map((preset) =>
              <PresetItem pres={show} setPreset={setShow} key={preset.p_name}>{preset}</PresetItem>
            )}
            { show.moves.length > 0 ?
                <DropdownMenu props={show.moves} p_id={show.p_id}/>
                :
                <div></div>
            }
            <MyModal visible={modal} setVisible={setModal}>
                <MyInput type="text" placeholder="preset name" value={presetName.value} onChange={e => setPresetName({...presetName, value: e.target.value})}/>
                <MyButton style={{marginTop: 5}} onClick={() => newPreset() && setModal(false)}> Add </MyButton>
            </MyModal>
            <MyButton style={{marginTop: 5}} onClick={() => modal ? setModal(false) : setModal(true)}> Add preset </MyButton>
        </div>
        
    );
};

export default PresetList;