import React from 'react';
import './menu.css';

function Menu({ isOpen }) {
    return (
        <div className={`menu ${isOpen ? 'open' : ''}`} />
    );
}

export default Menu;
