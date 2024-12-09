import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './Icons.module.css'; // Make sure you're importing the correct CSS module

const Icons = ({ hoveredIcon, handleMouseEnter, handleMouseLeave }) => {
  return (
    <div className={styles.menu}>
      {/* Search Icon */}
      <div
        className={classNames(styles.iconContainer, { [styles.iconHover]: hoveredIcon === 'search' })}
        title="Search"
        onMouseEnter={() => handleMouseEnter('search')}
        onMouseLeave={handleMouseLeave}
        aria-label="Search"
        tabIndex="0"
      >
        <FontAwesomeIcon icon={faSearch} size="sm" className={styles.icon} />
      </div>

      {/* Stop Button */}
      <div
        className={classNames(styles.stopButtonContainer, { [styles.stopButtonHover]: hoveredIcon === 'stop' })}
        title="Stop All Calls In Progress"
        onMouseEnter={() => handleMouseEnter('stop')}
        onMouseLeave={handleMouseLeave}
        aria-label="Stop All Calls"
        tabIndex="0"
      >
        <div className={styles.stopButton}>
          <div className={styles.stopIcon}>
            <div className={styles.stopSquare}></div>
          </div>
          <span className={styles.stopText}>StopAll</span>
        </div>
      </div>

      {/* Phone Icon */}
      <div
        className={classNames(styles.iconContainer, { [styles.iconHover]: hoveredIcon === 'call' })}
        title="Intercom/Paging is Ready"
        onMouseEnter={() => handleMouseEnter('call')}
        onMouseLeave={handleMouseLeave}
        aria-label="Intercom/Paging is Ready"
        tabIndex="0"
      >
        <FontAwesomeIcon icon={faPhoneAlt} size="sm" className={styles.greenIcon} />
      </div>

      {/* Profile Section */}
      <div
        className={classNames(styles.profileContainer, { [styles.iconHover]: hoveredIcon === 'profile' })}
        title="Manny's Profile"
        onMouseEnter={() => handleMouseEnter('profile')}
        onMouseLeave={handleMouseLeave}
        aria-label="Manny's Profile"
        tabIndex="0"
      >
        <div className={styles.userIcon}>M</div>
        <span className={styles.userName}>Manny</span>
      </div>
    </div>
  );
};

export default Icons;
