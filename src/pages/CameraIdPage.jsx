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
        const response = await PostService.rotateCamera(new_state.id, e)

        response.status_code === 200 ?
            console.log('camera: '+ new_state.id + ", direction: " + e)
        :
        console.log(response)

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
        const response = await PostService.resetCamera(new_state.id)
        console.log(response)
    }

    return (
        <div className = "row">
            <div className = "col">
                <div className = "leftside">
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
                        <strong style={{color: 'lightgray'}}>ID: {new_state.id}</strong>
                        <strong style={{color: 'lightgray'}}>IP: {new_state.ip}</strong> 
                        <strong style={{color: 'lightgray'}}>Location: <strong  style={{fontFamily: 'Roboto'}}>{new_state.loc}</strong></strong>
                        <strong style={{color: 'lightgray'}}>Name: {new_state.name}</strong>
                        <strong style={{color: 'lightgray'}}>Status: {new_state.status}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CameraIdPage;