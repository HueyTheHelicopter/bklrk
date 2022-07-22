import React, {useContext} from "react";
import {Routes, Route} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { publicRoutes, privateRoutes } from "../router";
import Login from "../pages/Login";
import { AuthContext } from "../context";

const AppRouter = () => {
    
    const { isAuth } = useContext(AuthContext);

    return (
        isAuth
        ?   
            <Routes>
                {privateRoutes.map(route => 
                    <Route 
                        element = {route.element}
                        path = {route.path}
                        exact = {route.exact}
                        key = {route.path}
                    />
                )}
                <Route path="*" element={<Dashboard/>}/>    
            </Routes>
        :
            <Routes>    
                {publicRoutes.map(route => 
                    <Route 
                        element = {route.element}
                        path = {route.path}
                        exact = {route.exact}
                        key = {route.path}
                    />
                )}
                <Route path="*" element={<Login/>}/> 
            </Routes>
    );
};

export default AppRouter;