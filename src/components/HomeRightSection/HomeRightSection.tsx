import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faDoorOpen, faCog } from '@fortawesome/free-solid-svg-icons';
import styles from './HomeRightSection.module.css'; // Import the CSS for styling
import PagingIntercomSection from '../PagingIntercomSection/PagingIntercomSection';
const HomeRightSection: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<string>(''); // State to track the selected tab

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
              <span>Paging/Intercom</span>
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
              <FontAwesomeIcon icon={faCog} /> {/* Settings Icon */}
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Conditionally render the PagingIntercomSection when Paging/Intercom is selected */}
      {selectedTab === 'Paging' && <PagingIntercomSection />}

      {/* You can add similar sections for Doors and Settings if needed */}
    </div>
  );
};

export default HomeRightSection;