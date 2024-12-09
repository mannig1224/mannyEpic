import React from 'react';

import styles from '../../styles/Devices.module.css';

const Devices: React.FC = () => {
  return (
    <div className={styles.container}>
      <div>Nav Section</div>.
      <main className={styles.main}>
        <h1 className={styles.title}>Devices</h1>
        <p className={styles.description}>
          This is the devices page. Here, you can manage your connected devices.
        </p>
        <ul className={styles.deviceList}>
          <li className={styles.device}>Device 1</li>
          <li className={styles.device}>Device 2</li>
          <li className={styles.device}>Device 3</li>
        </ul>
      </main>
    </div>
  );
};

export default Devices;
