import React, { useState } from "react";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import NewUserForm from '../components/NewUserForm';
import MyModal from '../components/UI/MyModal/MyModal';
import Loader from '../components/UI/Loader/Loader';
import { useFetching } from '../hooks/useFetching';
import PostService from '../API/PostService';
import '../styles/App.css';

const Login = () => {

    const [modal, setModal] = useState(false); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [handleLogin, isDataLoading, Error] = useFetching(async () => {
        const props = {
            "email": email,
            "password": password,
        };

        await PostService.userLogin(props)
        window.location.href = "/";
    })

    const regNewUser = async (user) => {

        try {
            await PostService.userRegistrate(user)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div class="row" style={{height: '100vh'}}>
            <div class="col">
                <div class="leftside">
                    <h1 style={{fontFamily: 'Roboto', fontSize: 52, color: '#C4C4C4'}}>
                        UVT SMART SPACE
                    </h1>
                    {isDataLoading &&
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Loader/>
                        </div> 
                    }
                </div>
            </div>
            <div class="col">
                <div class="rightside">
                    <form onSubmit={handleLogin}>
                        <MyInput type="text" placeholder="e-mail" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <MyInput type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <MyButton type="button" onClick={() => handleLogin()}>Login</MyButton>
                        <MyButton style={{marginLeft: '72.8%'}} type="button" onClick={() => setModal(true)}>Registration</MyButton>
                    </form>
                    <MyModal visible={modal} setVisible={setModal}>
                        <NewUserForm create={regNewUser}/>
                    </MyModal>
                    {Error && 
                        <h1 style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>Login Error occured: "{Error.message}"</h1>
                    }
                    
                </div>
            </div>
        </div>
    );
};

export default Login;