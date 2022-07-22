import {React, useContext} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import MyButton from '../components/UI/button/MyButton'
import Stream from "../components/UI/Stream/Stream";
import PostService from '../API/PostService';
import '../styles/App.css';
import { RecContext } from "../context";

const CameraIdPage = (state) => {

    const location = useLocation()
    const navigate = useNavigate()
    const { isRec } = useContext(RecContext)
    const new_state = location.state

    const camRotate = async (e) => {
        await PostService.rotateCamera(new_state.id, e)

        if (isRec) {
            if (!sessionStorage.getItem('moveset')) {
                sessionStorage.setItem('moveset', new_state.id + '|' + e +', ')
            } else {
                let storage = sessionStorage.getItem('moveset')
                storage = storage + new_state.id + '|' + e + ', '
                sessionStorage.setItem('moveset', storage)
            }
        }
    }
      
    const camReset = async () => {
        const respond = await PostService.resetCamera(new_state.id)
        console.log(respond)
    }

    return (
        <div class = "row">
            <div class = "col">
                <div class = "leftside">
                    <Stream camera={new_state} location={location}/>
                </div>
            </div>
            <div class = "col">
                <div name = "rightside" class = "rightside cam_nav">
                    <div name = "cam_btns" class = "cam_btns all">
                        <MyButton onClick={() => camRotate("wide")}>
                            zoom  -
                        </MyButton>
                        <MyButton onClick={() => camRotate("up")}>
                            up
                        </MyButton>
                        <MyButton onClick={() => camRotate("tele")}>
                            zoom +
                        </MyButton>
                        <MyButton onClick={() => camRotate("left")}>
                            left
                        </MyButton>
                        <MyButton onClick={() => camRotate("down")}>
                            down
                        </MyButton>
                        <MyButton onClick={() => camRotate("right")}>
                            right
                        </MyButton>
                        <MyButton onClick={() => navigate("/dashboard/" + new_state.id, {state})}>
                            open
                        </MyButton>
                        <MyButton onClick={() => camRotate("home")}>
                            home
                        </MyButton>
                        <MyButton onClick={() => camReset()}>
                            reset
                        </MyButton>
                        <MyButton onClick={() => camRotate("pan")}>
                            Pan
                        </MyButton>
                        <MyButton onClick={() => camRotate("stop")}>
                            Stop
                        </MyButton>
                        <MyButton onClick={() => camRotate("patrol")}>
                            Patrol
                        </MyButton>
                    </div>
                    <div className='cam_info'>
                        <strong>ID: {new_state.id}</strong>
                        <strong>IP: {new_state.ip}</strong> 
                        <strong style={{fontFamily: 'Roboto'}}>Location: {new_state.loc}</strong>
                        <strong>Name: {new_state.name}</strong>
                        <strong>Status: {new_state.status}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CameraIdPage;