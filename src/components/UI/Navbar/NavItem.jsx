import React from 'react';
import cl from './Navbar.module.css';

function NavItem(props) {
    return (
        <div>
            <div className={cl.nav_item}> 
                {props.children}
            </div>
        </div>
        
    )
}

export default NavItem;