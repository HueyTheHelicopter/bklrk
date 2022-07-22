import Map from '../pages/MapPage.jsx';
import Presets from '../pages/PresetPage.jsx';
import CameraIdPage from '../pages/CameraIdPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Login from '../pages/Login.jsx';

export const privateRoutes = [
    {path: "/map", element: <Map/>, exact: false},
    {path: "/presets", element: <Presets/>, exact: true},
    {path: "/dashboard", element: <Dashboard/>, exact: true},
    {path: "/dashboard/:id", element: <CameraIdPage/>, exact: true},
]

export const publicRoutes = [
    {path: "/login", element: <Login/>, exact: true},
]