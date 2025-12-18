import React from 'react';

function NavbarItem({ render, icone, isActive, ...props }) {
  if (render) {
    return (
      <li className={`nav-item ${isActive ? 'nav-item-active' : ''}`}>
        <a 
          onClick={props.onClick} 
          className={`nav-link d-flex align-items-center ${isActive ? 'nav-link-active' : ''}`} 
          style={{padding: '8px'}} 
          href={props.href}
        >
          {icone && <img src={icone} alt="" className='icone-menu me-2' width="16" height="16" />}
          {props.label}
        </a>
      </li>
    );
  } else {
    return false;
  }
}

export default NavbarItem;