import React, {useState, useEffect} from 'react';
import './styles/App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from './components/AppRouter';
import { AuthContext, RecContext, UserContext} from './context';
import Navbar from './components/UI/Navbar/Navbar';
import PostService from './API/PostService';

function App() {
  const [ isAuth, setIsAuth ] = useState(Boolean);
  const [ isRec, setIsRec ] = useState(Boolean);
  const [ user, setUser ] = useState("");

  const fetchUser = async () => {
    // obtaining user identity by sending jwt_token to
    // jwt_get_identity on BE so FE knows about the user
    // that keep being authorised.
    console.log("fetching user: " + user)
    console.log(sessionStorage.getItem('access_token'))
    let b = await PostService.getUserByToken(sessionStorage.getItem('access_token'))
    setUser(b.logged_in_as)
    setIsAuth(true)
  }

  useEffect(() => {

    if(sessionStorage.getItem('access_token') === 'undefined') {
      sessionStorage.clear()
    }

    if (!user && sessionStorage.getItem('access_token') && sessionStorage.getItem('access_token') !== 'null') {
        fetchUser().catch(console.error);
    }
    else {
      console.log(sessionStorage.getItem('access_token'))
      console.log("user: " + user);
    }
  }, [])

  return (
    <AuthContext.Provider value = {{isAuth, setIsAuth}}>
      <UserContext.Provider value = {{user, setUser}}>
      <RecContext.Provider value={{isRec, setIsRec}}>
        <BrowserRouter>
          {isAuth && <Navbar/>}
          <AppRouter/>
        </BrowserRouter>
      </RecContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  )
}

export default App;