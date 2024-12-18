"use client";

import React, { useState, useEffect } from "react";

import styles from './devices.module.css';
import DevicesTable from '../../components/devicesPageComponents/DevicesTable/DevicesTable';


const Devices: React.FC = () => {


  const [devices, setDevices] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:5000/api/devices")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received response from backend:", data); // Logs the devices
        setDevices(data); // Set the devices state
        setMessage("Successfully connected to backend"); // Set a success message
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error);
        setMessage("Failed to connect to backend");
      });
  }, []);
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
        
       <p>{message}</p>
       <ul>
        {devices.map((device, index) => (
          <li key={index}>
            {device.deviceName} - {device.deviceType}
          </li>
        ))}
      </ul>
      </main>
    </div>
  );
};

export default Devices;
