// components/CalendarYearSection/CalendarYearSection.tsx
"use client";
import React from 'react';
import styles from './CalendarYearSection.module.css';

const CalendarYearSection: React.FC = () => {
  return (
    <div className={styles.calendarYearContainer}>
      <h2>Calendar Year</h2>
      <p>Here’s where the calendar will go.</p>
      {/* Add a calendar component or placeholder here */}
    </div>
  );
};

export default CalendarYearSection;
