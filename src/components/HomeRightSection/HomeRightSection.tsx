import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faDoorOpen, faChalkboardTeacher, faMapMarkedAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import styles from './HomeRightSection.module.css'; // Import the CSS for styling
import PagingIntercomSection from '../PagingIntercomSection/PagingIntercomSection';
import RoomsSection from '../RoomsSection/RoomsSection';
import ZonesSection from '../ZonesSection/ZonesSection';
import DoorsSection from '../DoorsSection/DoorsSection';
import SettingsSection from '../SettingsSection/SettingsSection';
const HomeRightSection: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<string>('Paging'); // State to track the selected tab

  // Function to handle tab selection
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };
  return (
    <div className={styles.rightSection}>
      {/* Navbar with three options */}
      <nav className={styles.navbar}>
        <ul>
          <li>
            <button
              className={`${styles.navItem} ${selectedTab === 'Paging' ? styles.active : ''}`}
              onClick={() => handleTabChange('Paging')}
            >
              <FontAwesomeIcon icon={faBroadcastTower} /> {/* Paging/Intercom Icon */}
              <span>Paging</span>
            </button>
          </li>
          
          <li>
            <button
              className={`${styles.navItem} ${selectedTab === 'Rooms' ? styles.active : ''}`}
              onClick={() => handleTabChange('Rooms')}
            >
              <FontAwesomeIcon icon={faChalkboardTeacher} /> 
              <span>Rooms</span>
            </button>
          </li>
          <li>
            <button
              className={`${styles.navItem} ${selectedTab === 'Zones' ? styles.active : ''}`}
              onClick={() => handleTabChange('Zones')}
            >
              <FontAwesomeIcon icon={faMapMarkedAlt} /> 
              <span>Zones</span>
            </button>
          </li>
          <li>
            <button
              className={`${styles.navItem} ${selectedTab === 'Doors' ? styles.active : ''}`}
              onClick={() => handleTabChange('Doors')}
            >
              <FontAwesomeIcon icon={faDoorOpen} /> {/* Doors Icon */}
              <span>Doors</span>
            </button>
          </li>
          <li>
            <button
              className={`${styles.navItem} ${selectedTab === 'Settings' ? styles.active : ''}`}
              onClick={() => handleTabChange('Settings')}
            >
              <FontAwesomeIcon icon={faCog} /> 
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Conditionally render the PagingIntercomSection when Paging/Intercom is selected */}
      {selectedTab === 'Paging' && <PagingIntercomSection />}

      {selectedTab === 'Rooms' && <RoomsSection />}
      {selectedTab === 'Zones' && <ZonesSection />}
      {selectedTab === 'Doors' && <DoorsSection />}
      {selectedTab === 'Settings' && <SettingsSection />}
    </div>
  );
};

export default HomeRightSection;