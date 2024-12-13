import React from 'react';

import styles from './devices.module.css';
import DevicesTable from '../../components/devicesPageComponents/DevicesTable/DevicesTable';

const Devices: React.FC = () => {
  return (
    <div className={styles.mainContent}>


      <div className={styles.navSection}>
      <ul className={styles.optionsList}>


          <li className={styles.option}>
            <div className={`${styles.icon} ${styles.iconDiscover}`}>D</div>
            <div className={styles.textContent}>
              <h2 className={styles.title}>Devices</h2>
              <p className={styles.subtitle}>Devices added to Epic </p>
            </div>
          </li>
          <li className={styles.option}>
            <div className={`${styles.icon} ${styles.iconAdd}`}>D</div>
            <div className={styles.textContent}>
              <h2 className={styles.title}>Discover</h2>
              <p className={styles.subtitle}>Discover Devices</p>
            </div>
          </li>
          <li className={styles.option}>
            <div className={`${styles.icon} ${styles.iconConfigure}`}>D</div>
            <div className={styles.textContent}>
              <h2 className={styles.title}>Configure</h2>
              <p className={styles.subtitle}>
                Configure Devices In Bulk
              </p>
            </div>
          </li>
          <li className={styles.option}>
            <div className={`${styles.icon} ${styles.iconReboot}`}>D</div>
            <div className={styles.textContent}>
              <h2 className={styles.title}>Reboot</h2>
              <p className={styles.subtitle}>Reboot Devices</p>
            </div>
          </li>
          <li className={styles.option}>
            <div className={`${styles.icon} ${styles.iconUpdate}`}>D</div>
            <div className={styles.textContent}>
              <h2 className={styles.title}>Update</h2>
              <p className={styles.subtitle}>Update Devices</p>
            </div>
          </li>
        </ul>
      </div>
      <main className={styles.main}>
        
        <DevicesTable/>
      </main>
    </div>
  );
};

export default Devices;
