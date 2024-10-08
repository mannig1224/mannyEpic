"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'; // Import the correct type for icons
import styles from './NavItem.module.css'; // Import the CSS module

interface NavItemProps {
  icon: IconProp; // Use the specific type instead of 'any'
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
      <FontAwesomeIcon size="lg" icon={icon} /> {/* Use the FontAwesomeIcon with correct prop */}
      <span className={styles.label}>{label}</span>
    </li>
  );
};

export default NavItem;
