"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './NavItem.module.css'; // Import the CSS module

interface NavItemProps {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <li
      className={`${styles.item} ${
        hovered && !isActive ? styles.itemHover : ''
      } ${isActive ? styles.itemActive : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <FontAwesomeIcon size="lg" icon={icon} />
      <span className={styles.label}>{label}</span>
    </li>
  );
};

export default NavItem;
