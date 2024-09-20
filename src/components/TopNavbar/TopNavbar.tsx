"use client";
import React from 'react';
import Logo from '../Logo/Logo'; // Import the Logo component
import Icons from '../Icons/Icons'; // Import the Icons component
import SchoolLogo from '../SchoolLogo/SchoolLogo'; // Import the SchoolLogo component
import styles from './TopNavbar.module.css'; // Import the CSS module

const TopNavbar: React.FC = () => {
  const [hoveredIcon, setHoveredIcon] = React.useState<string | null>(null);

  const handleMouseEnter = (icon: string) => {
    setHoveredIcon(icon);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  return (
    <nav className={styles.navbar}>
      {/* Use the Logo component here */}
      <Logo />

      {/* Use the SchoolLogo component here */}
      <SchoolLogo />

      {/* Use the Icons component here */}
      <Icons
        hoveredIcon={hoveredIcon}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </nav>
  );
};

export default TopNavbar;
