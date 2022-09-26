import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import cl from './Navbar.module.css';
import PostService from '../../../API/PostService';
import NavItem from './NavItem';
import MyButton from '../button/MyButton';
import { AuthContext, RecContext, UserContext } from '../../../context';

const Navbar = () => {

    const navigate = useNavigate()
    const { setIsAuth } = useContext(AuthContext)
    const { isRec, setIsRec } = useContext(RecContext)
    const { user, setUser } = useContext(UserContext)

    const toggleRec = async () => {
        if (isRec){
            setIsRec(false);
            if (sessionStorage.getItem('moveset')) {
                sendMoveset();
            } else { console.log('No moveset found')}
        } else {
            // set cams to home, get response, if status 200 -> do evrthng what's below
            const response = await PostService.allCamsHome()
            response.status === 200 ?
                setIsRec(true)
                :
                console.error(response)
        }
    }

    const sendMoveset = async () => {
        try {
            let moveset = sessionStorage.getItem('moveset')
            let p_name = sessionStorage.getItem('p_name')

            if (moveset !== null && p_name !== null){
                const response = await PostService.sendNewPreset(moveset, p_name, user)

                if (response.status !== 200){
                    alert (response.msg)
                } else {
                    console.log(response.msg)
                    sessionStorage.removeItem('p_name');
                    sessionStorage.removeItem('moveset');
                }
            } else { alert ('moveset is empty or have no camera moves') }
        } catch (e) { alert (e) }
    }

    const handleLogout = async () => {
        try {
            let response = await PostService.userLogout()

            console.log(response)
            
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('my_id');
            setUser(null);
            setIsAuth(false);
        } catch (e) {
            alert(e)
        }
    }

    return (
        <div className={cl.navbar}>            
            <div className={cl.navbar_nav}>
                {isRec && 
                    <NavItem>
                    {/*
                        This indicator i'd like to make in some screen corner so it'll look like an indicator.
                        And clickable, to stop recording and save the preset.
                    */}
                        <MyButton onClick={() => toggleRec()}>
                                stop n save
                        </MyButton>
                    </NavItem>
                }
                <NavItem>
                    <MyButton onClick={handleLogout}>
                        Logout
                    </MyButton>
                </NavItem>
                <NavItem>
                    <MyButton onClick = {() => navigate('/presets')}>Presets</MyButton>
                </NavItem>
                <NavItem>
                    <MyButton onClick = {() => navigate('/dashboard')}>Dashboard</MyButton>
                </NavItem>
                <NavItem>
                    <MyButton onClick = {() => navigate('/map')}>Map</MyButton>
                </NavItem>
            </div>
        </div>
    );
};

export default Navbar;