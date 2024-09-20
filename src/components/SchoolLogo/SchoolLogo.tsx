import React from 'react';
import styles from './SchoolLogo.module.css'; // Import the CSS module

const SchoolLogo: React.FC = () => {
  return (
    <div className={styles.profileSection}>
      <img
        src="/images/Pine_View_Logo.png"
        alt="School Logo"
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
