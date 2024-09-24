import React from 'react';
import styles from './Logo.module.css'; // Use 'styles' for CSS Modules

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <img src="/images/generic-logo.png" alt="Logo" className={styles.logo} />
    </div>
  );
};

export default Logo;
