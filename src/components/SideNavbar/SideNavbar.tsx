"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faTools, faCalendarAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import NavItem from '../NavItem/NavItem'; // Import the NavItem component
import styles from './SideNavbar.module.css'; // Import the CSS module

const SideNavbar = () => {
  const [activeItem, setActiveItem] = React.useState('Home'); // Default active item

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        <NavItem
          icon={faHome}
          label="Home"
          isActive={activeItem === 'Home'}
          onClick={() => setActiveItem('Home')}
        />
        <NavItem
          icon={faBell}
          label="Bell Schedule"
          isActive={activeItem === 'Bell Schedule'}
          onClick={() => setActiveItem('Bell Schedule')}
        />
        <NavItem
          icon={faTools}
          label="Devices"
          isActive={activeItem === 'Devices'}
          onClick={() => setActiveItem('Devices')}
        />
        <NavItem
          icon={faCalendarAlt}
          label="Events"
          isActive={activeItem === 'Events'}
          onClick={() => setActiveItem('Events')}
        />
        <NavItem
          icon={faCog}
          label="Settings"
          isActive={activeItem === 'Settings'}
          onClick={() => setActiveItem('Settings')}
        />
      </ul>
    </div>
  );
};

export default SideNavbar;
