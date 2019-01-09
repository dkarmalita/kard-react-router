import React from 'react';
import { normilizeLocation } from '@kard/react-router';
import './Navbar.scss';

const renderEntry = (cfg, key) => {
  const { route } = normilizeLocation(window.location)
  const active = route === cfg.href
  return (
    <li key={ key }><a
      className={active ? 'active' : ''}
      href={ cfg.href }
    >{ cfg.title }</a></li>
  )
}

export const Navbar = (props) => {
  return (
    <div>
      <ul className='NavBar'>
        { props.config.map( (el, idx) => renderEntry(el, idx) ) }
      </ul>
    </div>
  )
}
