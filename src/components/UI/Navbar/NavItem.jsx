import React from 'react';
import cl from './Navbar.module.css';
import { ReactComponent as CamIcon } from './icons/CamIcon.svg'

function NavItem(props) {
    return (
        <li className={cl.nav_item}>
            <a href="#" className={cl.icon_button}>
                {props.children}
            </a>
        </li>
    )
}

export default NavItem;