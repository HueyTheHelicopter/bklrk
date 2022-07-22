import React, {useState} from 'react';
import MyButton from './UI/button/MyButton';
import MyInput from './UI/input/MyInput';
import PostService from '../API/PostService';
import { useFetching } from '../hooks/useFetching';

const NewUserForm = () => {
    const [user, setUser] = useState({
        id: '',
        username: '',
        email: '',
        password: '',
        repeat_password: ''
    })

    const [addNewUser] = useFetching(async () => {
        const props = {
            username: user.username,
            email: user.email,
            password: user.password,
            repeat_password: user.repeat_password
        }

        await PostService.userRegistrate(props)
        .then(response => {
            if (response.status === 200) {
                console.log(response.msg, response.login, response.status)
            } else { console.log(response.msg, response.login, response.status) }
        })
    })

    return (
        <form>
            <MyInput 
                value={user.username}
                onChange={e => setUser({...user, username: e.target.value})}
                type="text"
                placeholder="Username"
            />
            <MyInput 
                value={user.email} 
                onChange={e => setUser({...user, email: e.target.value})}
                type="text"
                placeholder="E-mail"
            />
            <MyInput 
                value={user.password} 
                onChange={e => setUser({...user, password: e.target.value})}
                type="text"
                placeholder="Password"
            />
            <MyInput 
                value={user.repeat_password} 
                onChange={e => setUser({...user, repeat_password: e.target.value})}
                type="text"
                placeholder="Please repeat your password"
            />
            <MyButton style={{text_align: 'center'}} onClick={addNewUser}>Confirm</MyButton>
      </form>
    );
};

export default NewUserForm;