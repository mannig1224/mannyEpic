import React from 'react';
import Image from 'next/image'; // Import Image from next/image
import styles from './Logo.module.css'; // Use 'styles' for CSS Modules

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      {/* Use Next.js Image component */}
      <Image 
        src="/images/generic-logo.png" 
        alt="School Logo" 
        width={500} // Replace with the actual width of your image
        height={500} // Replace with the actual height of your image
        className={styles.logo} 
      />
    </div>
  );
};

export default Logo;
