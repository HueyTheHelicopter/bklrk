import React, { useContext } from 'react';
import MyButton from '../button/MyButton';
import { useNavigate } from "react-router-dom";
import { AuthContext, RecContext, UserContext } from '../../../context';
import PostService from '../../../API/PostService';

const Navbar = () => {

    const navigate = useNavigate()
    const { setIsAuth } = useContext(AuthContext)
    const { isRec, setIsRec } = useContext(RecContext)
    const { user, setUser } = useContext(UserContext)

    const toggleRec = () => {
        if (isRec){
            setIsRec(false);
            if (sessionStorage.getItem('moveset')) {
                sendMoveset();
            } else { console.log('No moveset found')}
        } else {
            setIsRec(true);
        }
    }

    const sendMoveset = async () => {
        try {
            let moveset = sessionStorage.getItem('moveset')
            let p_name = sessionStorage.getItem('p_name')

            if (moveset !== null){
                // console.log('sending presetName: ' + sessionStorage.getItem('p_name'))
                const response = await PostService.sendNewPreset(moveset, p_name, user)

                if (response.status !== 200){
                    alert (response.msg)
                } else {
                    console.log(response.msg)
                    sessionStorage.removeItem('p_name');
                }

            } else { alert ('moveset is empty') }
            sessionStorage.removeItem('moveset')
        } catch (e) { alert (e) }
    }

    const handleLogout = async () => {
        try {
            let response = await PostService.userLogout()

            console.log(response)
            
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('my_id');
            setUser("");
            setIsAuth(false);
        } catch (e) {
            alert(e)
        }
    }

    return (
        <div className='navbar'>            
            <MyButton onClick={handleLogout}>
                Logout
            </MyButton>
            {isRec && 
                <div className='navbar_rec_indicator'>
                {/*
                    This indicator i'd like to make in some screen corner so it'll look like an indicator.
                    And clickable, to stop recording and save the preset.
                */}
                <MyButton onClick={() => toggleRec()}>
                        stop n save
                </MyButton>
            </div>
            }
            <div className='navbar__links'>
                <MyButton style={{marginRight: "5px"}}  onClick = {() => navigate('/presets')}>Presets</MyButton>
                <MyButton style={{marginRight: "5px"}}  onClick = {() => navigate('/dashboard')}>Dashboard</MyButton>
                <MyButton onClick = {() => navigate('/map')}>Map</MyButton>
            </div>
        </div>
    );
};

export default Navbar;