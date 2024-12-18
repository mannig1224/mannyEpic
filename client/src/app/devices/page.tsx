"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styles from './devices.module.css';
import DevicesTable from '../../components/devicesPageComponents/DevicesTable/DevicesTable';

// Create a query client instance
const queryClient = new QueryClient();

const Devices: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
                <p className={styles.subtitle}>Configure Devices In Bulk</p>
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
    </QueryClientProvider>
  );
};

export default Devices;
