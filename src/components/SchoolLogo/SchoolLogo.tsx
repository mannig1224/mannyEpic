import React from 'react';
import Image from 'next/image'; // Import Image from next/image
import styles from './SchoolLogo.module.css'; // Import the CSS module

const SchoolLogo: React.FC = () => {
  return (
    <div className={styles.profileSection}>
      <Image
        src="/images/Pine_View_Logo.png" // Use Next.js Image component
        alt="School Logo"
        width={100} // Provide the actual width of the logo image
        height={100} // Provide the actual height of the logo image
        className={styles.avatar}
      />
      <div className={styles.profileDetails}>
        <span className={styles.username}>Wizard Advanced</span>
        <span className={styles.timestamp}>16-09-2024 11:02:37</span>
      </div>
    </div>
  );
};

export default SchoolLogo;

