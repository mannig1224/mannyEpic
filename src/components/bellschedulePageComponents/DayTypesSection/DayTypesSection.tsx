"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { SketchPicker } from 'react-color';
import styles from './DayTypesSection.module.css';

interface DayType {
  name: string;
  color: string;
}

const DayTypesSection: React.FC = () => {
  const [dayTypes, setDayTypes] = useState<DayType[]>([
    { name: 'Regular Day', color: '#f44336' },
    { name: 'Early Release', color: '#2196f3' },
    { name: 'Holiday', color: '#ffeb3b' },
    { name: 'Special Event', color: '#9c27b0' },
    { name: 'Monday', color: '#4caf50' },
    { name: 'Tuesday', color: '#ff9800' },
    { name: 'Wednesday', color: '#03a9f4' },
    { name: 'Thursday', color: '#e91e63' },
    { name: 'Friday', color: '#00bcd4' },
    { name: 'Saturday', color: '#607d8b' },
    { name: 'Sunday', color: '#795548' },
  ]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addDayType = () => {
    const newDayType = prompt("Enter the name for the new day type:");
    if (newDayType) {
      setDayTypes([...dayTypes, { name: newDayType, color: '#000000' }]);
    }
  };

  const handleEditDayType = (currentDayType: string) => {
    const newDayType = prompt(`Edit Day Type: ${currentDayType}`, currentDayType);
    if (newDayType && newDayType !== currentDayType) {
      setDayTypes(dayTypes.map(dayType => dayType.name === currentDayType ? { ...dayType, name: newDayType } : dayType));
    }
  };



  return (
    <div className={styles.dayTypesContainer}>
      <div className={styles.dayTypeHeading}>
        <h2>Day Types</h2>
        <FontAwesomeIcon
          icon={faPlus}
          className={styles.addIcon}
          onClick={addDayType}
          title="Add new day type"
        />
      </div>

      <div className={styles.scrollableList}>
        <ul>
          {dayTypes.map((dayType, index) => (
            <li key={index} className={styles.listItem}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                    backgroundColor: dayType.color,
                    width: '20px',
                    height: '20px',
                    borderRadius: '25%',
                    marginRight: '10px',
                    border: '1.5px solid #ddd', // Add a light gray border
                    cursor: 'pointer',
                  }}
                  onClick={() => setEditingIndex(index === editingIndex ? null : index)}
                />
                {dayType.name}
                </div>
                <FontAwesomeIcon
                  icon={faEdit}
                  className={styles.editIcon}
                  onClick={() => handleEditDayType(dayType.name)}
                />
              

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DayTypesSection;
